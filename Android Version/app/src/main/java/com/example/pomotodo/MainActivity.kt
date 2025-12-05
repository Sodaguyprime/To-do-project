package com.example.pomotodo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.pomotodo.ui.components.Footer
import com.example.pomotodo.ui.components.Header
import com.example.pomotodo.ui.screens.PomodoroScreen
import com.example.pomotodo.ui.screens.TodoScreen
import com.example.pomotodo.ui.theme.PomoColors
import com.example.pomotodo.viewmodel.PomoViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PomoTodoApp()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PomoTodoApp() {
    val viewModel: PomoViewModel = viewModel()
    var selectedTab by remember { mutableStateOf(0) }
    val activeTodoCount by viewModel.activeTodoCount.collectAsState()

    MaterialTheme(
        colorScheme = MaterialTheme.colorScheme.copy(
            primary = PomoColors.AccentPrimary,
            secondary = PomoColors.AccentSecondary,
            background = PomoColors.BackgroundPrimary,
            surface = PomoColors.PanelBackground
        )
    ) {
        Scaffold(
            topBar = {
                Header(
                    selectedTab = selectedTab,
                    onTabSelected = { selectedTab = it },
                    activeTodoCount = activeTodoCount
                )
            },
            bottomBar = {
                Footer()
            }
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(it),
                color = PomoColors.BackgroundPrimary
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .widthIn(max = 520.dp)
                ) {
                    when (selectedTab) {
                        0 -> TodoScreen(viewModel = viewModel)
                        1 -> PomodoroScreen(viewModel = viewModel)
                    }
                }
            }
        }
    }
}