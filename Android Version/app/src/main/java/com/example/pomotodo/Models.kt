package com.example.pomotodo.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.pomotodo.ui.theme.TodoPriority

@Entity(tableName = "todos")
data class Todo(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val text: String,
    val done: Boolean = false,
    val priority: TodoPriority = TodoPriority.LOW,
    val createdAt: Long = System.currentTimeMillis()
)

data class PomodoroState(
    val mode: PomodoroMode = PomodoroMode.WORK,
    val timeLeftSeconds: Int = 1500, // 25 minutes default
    val isRunning: Boolean = false,
    val workDurationMinutes: Int = 25,
    val completedPomodoros: Int = 0,
    val totalStudyMinutes: Int = 0
) {
    val sessionNumber: Int
        get() = (completedPomodoros / 4) + 1
}

enum class PomodoroMode(val label: String, val emoji: String) {
    WORK("FOCUS TIME", "🎯"),
    SHORT_BREAK("SHORT BREAK", "☕"),
    LONG_BREAK("LONG BREAK", "🌴");

    fun getDuration(workDuration: Int): Int {
        return when (this) {
            WORK -> workDuration * 60
            SHORT_BREAK -> 5 * 60
            LONG_BREAK -> 15 * 60
        }
    }
}

data class WeeklyStats(
    val days: List<Int> = List(7) { 0 }, // Mon-Sun
    val lastUpdate: Long = System.currentTimeMillis()
) {
    val totalMinutes: Int
        get() = days.sum()

    fun formatTotal(): String {
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        return if (hours > 0) "${hours}h ${minutes}m" else "${minutes}m"
    }
}

enum class TodoFilter {
    ALL, ACTIVE, DONE
}