package com.example.pomotodo.data.local

import android.content.Context
import androidx.room.*
import androidx.room.RoomDatabase
import com.example.pomotodo.data.model.Todo
import com.example.pomotodo.ui.theme.TodoPriority
import kotlinx.coroutines.flow.Flow

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY " +
            "CASE priority " +
            "WHEN 'HIGH' THEN 1 " +
            "WHEN 'MEDIUM' THEN 2 " +
            "WHEN 'LOW' THEN 3 " +
            "END, createdAt ASC")
    fun getAllTodos(): Flow<List<Todo>>

    @Insert
    suspend fun insertTodo(todo: Todo)

    @Update
    suspend fun updateTodo(todo: Todo)

    @Delete
    suspend fun deleteTodo(todo: Todo)

    @Query("DELETE FROM todos WHERE done = 1")
    suspend fun deleteCompletedTodos()
}

@Database(entities = [Todo::class], version = 1, exportSchema = false)
@TypeConverters(Converters::class)
abstract class PomoDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao

    companion object {
        @Volatile
        private var INSTANCE: PomoDatabase? = null

        fun getDatabase(context: Context): PomoDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PomoDatabase::class.java,
                    "pomo_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

class Converters {
    @TypeConverter
    fun fromPriority(priority: TodoPriority): String = priority.name

    @TypeConverter
    fun toPriority(value: String): TodoPriority = TodoPriority.valueOf(value)
}