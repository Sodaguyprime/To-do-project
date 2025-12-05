package com.example.pomotodo.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.pomotodo.data.local.PomoDatabase
import com.example.pomotodo.data.model.*
import com.example.pomotodo.data.repository.PomodoroRepository
import com.example.pomotodo.data.repository.TodoRepository
import com.example.pomotodo.ui.theme.TodoPriority
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class PomoViewModel(application: Application) : AndroidViewModel(application) {

    private val todoRepository: TodoRepository
    private val pomodoroRepository: PomodoroRepository

    init {
        val database = PomoDatabase.getDatabase(application)
        todoRepository = TodoRepository(database.todoDao())
        pomodoroRepository = PomodoroRepository(application)

        // Load saved pomodoro state
        viewModelScope.launch {
            val completed = pomodoroRepository.getCompletedPomodoros()
            val totalMinutes = pomodoroRepository.getTotalStudyMinutes()
            val workDuration = pomodoroRepository.getWorkDuration()

            _pomodoroState.update {
                it.copy(
                    completedPomodoros = completed,
                    totalStudyMinutes = totalMinutes,
                    workDurationMinutes = workDuration,
                    timeLeftSeconds = workDuration * 60
                )
            }
        }
    }

    // Todo State
    val todos: StateFlow<List<Todo>> = todoRepository.getAllTodos()
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    private val _todoFilter = MutableStateFlow(TodoFilter.ALL)
    val todoFilter: StateFlow<TodoFilter> = _todoFilter.asStateFlow()

    private val _inputText = MutableStateFlow("")
    val inputText: StateFlow<String> = _inputText.asStateFlow()

    private val _selectedPriority = MutableStateFlow(TodoPriority.LOW)
    val selectedPriority: StateFlow<TodoPriority> = _selectedPriority.asStateFlow()

    private val _editingTodoId = MutableStateFlow<Long?>(null)
    val editingTodoId: StateFlow<Long?> = _editingTodoId.asStateFlow()

    val filteredTodos: StateFlow<List<Todo>> = combine(todos, todoFilter) { list, filter ->
        when (filter) {
            TodoFilter.ALL -> list
            TodoFilter.ACTIVE -> list.filter { !it.done }
            TodoFilter.DONE -> list.filter { it.done }
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    val activeTodoCount: StateFlow<Int> = todos.map { list ->
        list.count { !it.done }
    }.stateIn(viewModelScope, SharingStarted.Lazily, 0)

    // Pomodoro State
    private val _pomodoroState = MutableStateFlow(PomodoroState())
    val pomodoroState: StateFlow<PomodoroState> = _pomodoroState.asStateFlow()

    private var timerJob: Job? = null

    // Weekly Stats
    private val _weeklyStats = MutableStateFlow(WeeklyStats())
    val weeklyStats: StateFlow<WeeklyStats> = _weeklyStats.asStateFlow()

    init {
        viewModelScope.launch {
            _weeklyStats.value = pomodoroRepository.getWeeklyStats()
        }
    }

    // Todo Actions
    fun setInputText(text: String) {
        _inputText.value = text
    }

    fun cyclePriority() {
        _selectedPriority.value = _selectedPriority.value.next()
    }

    fun addTodo() {
        val text = _inputText.value.trim()
        if (text.isEmpty()) return

        viewModelScope.launch {
            todoRepository.insertTodo(
                Todo(
                    text = text,
                    priority = _selectedPriority.value
                )
            )
            _inputText.value = ""
            _selectedPriority.value = TodoPriority.LOW
        }
    }

    fun toggleTodo(todo: Todo) {
        viewModelScope.launch {
            todoRepository.updateTodo(todo.copy(done = !todo.done))
        }
    }

    fun updateTodo(todo: Todo) {
        viewModelScope.launch {
            todoRepository.updateTodo(todo)
        }
    }

    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            todoRepository.deleteTodo(todo)
        }
    }

    fun setTodoFilter(filter: TodoFilter) {
        _todoFilter.value = filter
    }

    fun clearCompletedTodos() {
        viewModelScope.launch {
            todoRepository.deleteCompletedTodos()
        }
    }

    fun startEditingTodo(todoId: Long) {
        _editingTodoId.value = todoId
    }

    fun stopEditingTodo() {
        _editingTodoId.value = null
    }

    // Pomodoro Actions
    fun toggleTimer() {
        val state = _pomodoroState.value
        if (state.isRunning) {
            pauseTimer()
        } else {
            startTimer()
        }
    }

    private fun startTimer() {
        _pomodoroState.update { it.copy(isRunning = true) }

        timerJob = viewModelScope.launch {
            while (_pomodoroState.value.timeLeftSeconds > 0 && _pomodoroState.value.isRunning) {
                delay(1000)
                _pomodoroState.update {
                    it.copy(timeLeftSeconds = it.timeLeftSeconds - 1)
                }
            }

            if (_pomodoroState.value.timeLeftSeconds == 0) {
                onTimerComplete()
            }
        }
    }

    private fun pauseTimer() {
        timerJob?.cancel()
        _pomodoroState.update { it.copy(isRunning = false) }
    }

    fun endSession() {
        timerJob?.cancel()
        val state = _pomodoroState.value
        _pomodoroState.update {
            it.copy(
                isRunning = false,
                timeLeftSeconds = state.mode.getDuration(state.workDurationMinutes)
            )
        }
    }

    fun setMode(mode: PomodoroMode) {
        timerJob?.cancel()
        val state = _pomodoroState.value
        _pomodoroState.update {
            it.copy(
                mode = mode,
                isRunning = false,
                timeLeftSeconds = mode.getDuration(state.workDurationMinutes)
            )
        }
    }

    fun setWorkDuration(minutes: Int) {
        if (_pomodoroState.value.isRunning) return

        _pomodoroState.update {
            it.copy(
                workDurationMinutes = minutes,
                timeLeftSeconds = if (it.mode == PomodoroMode.WORK) {
                    minutes * 60
                } else {
                    it.timeLeftSeconds
                }
            )
        }

        viewModelScope.launch {
            pomodoroRepository.saveWorkDuration(minutes)
        }
    }

    private fun onTimerComplete() {
        val state = _pomodoroState.value

        when (state.mode) {
            PomodoroMode.WORK -> {
                val newCompleted = state.completedPomodoros + 1
                val newTotal = state.totalStudyMinutes + state.workDurationMinutes

                viewModelScope.launch {
                    pomodoroRepository.saveCompletedPomodoros(newCompleted)
                    pomodoroRepository.saveTotalStudyMinutes(newTotal)
                    pomodoroRepository.updateTodayStudyMinutes(state.workDurationMinutes)
                    _weeklyStats.value = pomodoroRepository.getWeeklyStats()
                }

                // Auto-transition to break
                val nextMode = if (newCompleted % 4 == 0) {
                    PomodoroMode.LONG_BREAK
                } else {
                    PomodoroMode.SHORT_BREAK
                }

                _pomodoroState.update {
                    it.copy(
                        mode = nextMode,
                        isRunning = false,
                        completedPomodoros = newCompleted,
                        totalStudyMinutes = newTotal,
                        timeLeftSeconds = nextMode.getDuration(state.workDurationMinutes)
                    )
                }
            }
            PomodoroMode.SHORT_BREAK, PomodoroMode.LONG_BREAK -> {
                _pomodoroState.update {
                    it.copy(
                        mode = PomodoroMode.WORK,
                        isRunning = false,
                        timeLeftSeconds = it.workDurationMinutes * 60
                    )
                }
            }
        }

        // TODO: Play notification sound and vibrate
    }
}