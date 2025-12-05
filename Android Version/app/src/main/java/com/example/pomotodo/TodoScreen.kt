package com.example.pomotodo.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.pomotodo.data.model.Todo
import com.example.pomotodo.data.model.TodoFilter
import com.example.pomotodo.ui.components.*
import com.example.pomotodo.ui.theme.*
import com.example.pomotodo.viewmodel.PomoViewModel

@Composable
fun TodoScreen(viewModel: PomoViewModel) {
    val todos by viewModel.filteredTodos.collectAsState()
    val inputText by viewModel.inputText.collectAsState()
    val selectedPriority by viewModel.selectedPriority.collectAsState()
    val filter by viewModel.todoFilter.collectAsState()
    val editingId by viewModel.editingTodoId.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Add Todo Bar
        AddTodoBar(
            text = inputText,
            onTextChange = { viewModel.setInputText(it) },
            priority = selectedPriority,
            onPriorityClick = { viewModel.cyclePriority() },
            onAdd = { viewModel.addTodo() }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Todo List
        if (todos.isEmpty()) {
            EmptyState()
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                todos.forEach { todo ->
                    TodoItem(
                        todo = todo,
                        isEditing = todo.id == editingId,
                        onToggle = { viewModel.toggleTodo(todo) },
                        onEdit = { viewModel.startEditingTodo(todo.id) },
                        onSave = { newText ->
                            viewModel.updateTodo(todo.copy(text = newText))
                            viewModel.stopEditingTodo()
                        },
                        onDelete = { viewModel.deleteTodo(todo) },
                        onPriorityChange = {
                            viewModel.updateTodo(todo.copy(priority = todo.priority.next()))
                        },
                        onCancelEdit = { viewModel.stopEditingTodo() }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Filter Footer
        TodoFilterFooter(
            currentFilter = filter,
            onFilterChange = { viewModel.setTodoFilter(it) },
            onClearCompleted = { viewModel.clearCompletedTodos() },
            hasCompletedTodos = todos.any { it.done }
        )
    }
}

@Composable
fun AddTodoBar(
    text: String,
    onTextChange: (String) -> Unit,
    priority: TodoPriority,
    onPriorityClick: () -> Unit,
    onAdd: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PixelTextField(
            value = text,
            onValueChange = onTextChange,
            placeholder = "Type in your To-do",
            modifier = Modifier.weight(1f)
        )

        if (text.isNotEmpty()) {
            PriorityButton(
                priority = priority,
                onClick = onPriorityClick
            )
        }

        PixelButton(
            text = "+",
            onClick = onAdd,
            enabled = text.isNotEmpty(),
            modifier = Modifier.size(48.dp)
        )
    }
}

@Composable
fun TodoItem(
    todo: Todo,
    isEditing: Boolean,
    onToggle: () -> Unit,
    onEdit: () -> Unit,
    onSave: (String) -> Unit,
    onDelete: () -> Unit,
    onPriorityChange: () -> Unit,
    onCancelEdit: () -> Unit
) {
    var editText by remember(isEditing) { mutableStateOf(todo.text) }
    var showActions by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(8.dp))
            .background(PomoColors.PanelBackground, RoundedCornerShape(8.dp))
            .border(
                BorderStroke(4.dp, PomoColors.Shadow),
                RoundedCornerShape(8.dp)
            )
    ) {
        // Priority border
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .width(8.dp)
                .background(
                    getPriorityColor(todo.priority),
                    RoundedCornerShape(topStart = 8.dp, bottomStart = 8.dp)
                )
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 12.dp, top = 12.dp, bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Checkbox
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .shadow(2.dp, RoundedCornerShape(4.dp))
                    .background(
                        if (todo.done) PomoColors.AccentPrimary else PomoColors.PanelSecondary,
                        RoundedCornerShape(4.dp)
                    )
                    .border(2.dp, PomoColors.Shadow, RoundedCornerShape(4.dp))
                    .clickable { onToggle() },
                contentAlignment = Alignment.Center
            ) {
                if (todo.done) {
                    Text(
                        text = "✓",
                        style = PomoTypography.bodyMedium,
                        color = PomoColors.BackgroundPrimary
                    )
                }
            }

            // Text or Edit Field
            if (isEditing) {
                PixelTextField(
                    value = editText,
                    onValueChange = { editText = it },
                    placeholder = "Edit todo",
                    modifier = Modifier.weight(1f)
                )
            } else {
                Text(
                    text = todo.text,
                    style = PomoTypography.bodyMedium.copy(
                        textDecoration = if (todo.done) TextDecoration.LineThrough else null
                    ),
                    color = if (todo.done) PomoColors.TextMuted else PomoColors.TextPrimary,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { showActions = !showActions }
                )
            }

            // Priority Button
            PriorityButton(
                priority = todo.priority,
                onClick = onPriorityChange
            )
        }

        // Action Buttons
        if (showActions && !isEditing) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                PixelButton(
                    text = "Edit",
                    onClick = {
                        onEdit()
                        showActions = false
                    },
                    backgroundColor = PomoColors.Warning,
                    modifier = Modifier.height(36.dp)
                )

                PixelButton(
                    text = "Delete",
                    onClick = {
                        onDelete()
                        showActions = false
                    },
                    backgroundColor = PomoColors.Danger,
                    modifier = Modifier.height(36.dp)
                )
            }
        }

        if (isEditing) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                PixelButton(
                    text = "Cancel",
                    onClick = onCancelEdit,
                    backgroundColor = PomoColors.PanelSecondary,
                    modifier = Modifier.height(36.dp)
                )

                PixelButton(
                    text = "Save",
                    onClick = { onSave(editText) },
                    backgroundColor = PomoColors.AccentPrimary,
                    modifier = Modifier.height(36.dp)
                )
            }
        }
    }
}

@Composable
fun TodoFilterFooter(
    currentFilter: TodoFilter,
    onFilterChange: (TodoFilter) -> Unit,
    onClearCompleted: () -> Unit,
    hasCompletedTodos: Boolean
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Filter Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            TodoFilter.values().forEach { filter ->
                PixelButton(
                    text = filter.name,
                    onClick = { onFilterChange(filter) },
                    backgroundColor = if (currentFilter == filter) {
                        PomoColors.AccentPrimary
                    } else {
                        PomoColors.PanelSecondary
                    },
                    textColor = if (currentFilter == filter) {
                        PomoColors.BackgroundPrimary
                    } else {
                        PomoColors.TextPrimary
                    },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Clear Completed
        if (hasCompletedTodos) {
            PixelButton(
                text = "Clear Completed",
                onClick = onClearCompleted,
                backgroundColor = PomoColors.Danger,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun EmptyState() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(48.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "No todos here yet.",
            style = PomoTypography.bodyLarge,
            color = PomoColors.TextMuted
        )
    }
}