package com.example.pomotodo.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.example.pomotodo.data.local.TodoDao
import com.example.pomotodo.data.model.Todo
import com.example.pomotodo.data.model.WeeklyStats
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.util.*

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "pomo_prefs")

class TodoRepository(private val todoDao: TodoDao) {
    fun getAllTodos(): Flow<List<Todo>> = todoDao.getAllTodos()

    suspend fun insertTodo(todo: Todo) = todoDao.insertTodo(todo)

    suspend fun updateTodo(todo: Todo) = todoDao.updateTodo(todo)

    suspend fun deleteTodo(todo: Todo) = todoDao.deleteTodo(todo)

    suspend fun deleteCompletedTodos() = todoDao.deleteCompletedTodos()
}

class PomodoroRepository(private val context: Context) {
    private val dataStore = context.dataStore

    companion object {
        private val COMPLETED_POMODOROS = intPreferencesKey("completed_pomodoros")
        private val TOTAL_STUDY_MINUTES = intPreferencesKey("total_study_minutes")
        private val WORK_DURATION = intPreferencesKey("work_duration")

        // Weekly stats keys
        private val WEEKLY_DAYS = stringPreferencesKey("weekly_days")
        private val LAST_UPDATE = longPreferencesKey("last_update")
    }

    suspend fun saveCompletedPomodoros(count: Int) {
        dataStore.edit { prefs ->
            prefs[COMPLETED_POMODOROS] = count
        }
    }

    suspend fun getCompletedPomodoros(): Int {
        return dataStore.data.first()[COMPLETED_POMODOROS] ?: 0
    }

    suspend fun saveTotalStudyMinutes(minutes: Int) {
        dataStore.edit { prefs ->
            prefs[TOTAL_STUDY_MINUTES] = minutes
        }
    }

    suspend fun getTotalStudyMinutes(): Int {
        return dataStore.data.first()[TOTAL_STUDY_MINUTES] ?: 0
    }

    suspend fun saveWorkDuration(minutes: Int) {
        dataStore.edit { prefs ->
            prefs[WORK_DURATION] = minutes
        }
    }

    suspend fun getWorkDuration(): Int {
        return dataStore.data.first()[WORK_DURATION] ?: 25
    }

    suspend fun saveWeeklyStats(stats: WeeklyStats) {
        dataStore.edit { prefs ->
            prefs[WEEKLY_DAYS] = stats.days.joinToString(",")
            prefs[LAST_UPDATE] = stats.lastUpdate
        }
    }

    suspend fun getWeeklyStats(): WeeklyStats {
        val prefs = dataStore.data.first()
        val daysString = prefs[WEEKLY_DAYS] ?: "0,0,0,0,0,0,0"
        val days = daysString.split(",").map { it.toIntOrNull() ?: 0 }
        val lastUpdate = prefs[LAST_UPDATE] ?: System.currentTimeMillis()

        return WeeklyStats(days, lastUpdate)
    }

    suspend fun updateTodayStudyMinutes(additionalMinutes: Int) {
        val stats = getWeeklyStats()
        val calendar = Calendar.getInstance()

        // Check if we need to reset (new week)
        val lastCalendar = Calendar.getInstance().apply {
            timeInMillis = stats.lastUpdate
        }

        val needsReset = calendar.get(Calendar.WEEK_OF_YEAR) !=
                lastCalendar.get(Calendar.WEEK_OF_YEAR) ||
                calendar.get(Calendar.YEAR) != lastCalendar.get(Calendar.YEAR)

        val newDays = if (needsReset) {
            MutableList(7) { 0 }
        } else {
            stats.days.toMutableList()
        }

        // Monday = 0, Sunday = 6
        val dayIndex = when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.MONDAY -> 0
            Calendar.TUESDAY -> 1
            Calendar.WEDNESDAY -> 2
            Calendar.THURSDAY -> 3
            Calendar.FRIDAY -> 4
            Calendar.SATURDAY -> 5
            Calendar.SUNDAY -> 6
            else -> 0
        }

        newDays[dayIndex] = newDays[dayIndex] + additionalMinutes

        saveWeeklyStats(WeeklyStats(newDays, System.currentTimeMillis()))
    }
}
