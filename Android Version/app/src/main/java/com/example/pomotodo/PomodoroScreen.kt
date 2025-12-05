package com.example.pomotodo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.pomotodo.data.model.PomodoroMode
import com.example.pomotodo.ui.components.PixelButton
import com.example.pomotodo.ui.components.PixelPanel
import com.example.pomotodo.ui.theme.PomoColors
import com.example.pomotodo.ui.theme.PomoTypography
import com.example.pomotodo.viewmodel.PomoViewModel

@Composable
fun PomodoroScreen(viewModel: PomoViewModel) {
    val state by viewModel.pomodoroState.collectAsState()
    val weeklyStats by viewModel.weeklyStats.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Mode Label
        ModeLabel(state.mode)

        // Timer Display
        TimerDisplay(
            timeLeftSeconds = state.timeLeftSeconds,
            mode = state.mode
        )

        // Progress Bar
        ProgressBar(
            progress = calculateProgress(state.timeLeftSeconds, state.mode, state.workDurationMinutes),
            mode = state.mode
        )

        // Controls
        PomodoroControls(
            isRunning = state.isRunning,
            onStartPause = { viewModel.toggleTimer() },
            onEnd = { viewModel.endSession() }
        )

        // Mode Switcher
        ModeSwitcher(
            currentMode = state.mode,
            onModeChange = { viewModel.setMode(it) },
            isRunning = state.isRunning
        )

        // Duration Selector (only for work mode when stopped)
        if (state.mode == PomodoroMode.WORK && !state.isRunning) {
            DurationSelector(
                selectedDuration = state.workDurationMinutes,
                onDurationChange = { viewModel.setWorkDuration(it) }
            )
        }

        // Stats
        PomodoroStats(
            completedPomodoros = state.completedPomodoros,
            sessionNumber = state.sessionNumber
        )

        // Weekly Stats
        WeeklyStatsCard(weeklyStats = weeklyStats)
    }
}

@Composable
fun ModeLabel(mode: PomodoroMode) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(8.dp))
            .background(getModeColor(mode).copy(alpha = 0.2f), RoundedCornerShape(8.dp))
            .border(3.dp, getModeColor(mode), RoundedCornerShape(8.dp))
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "${mode.emoji} ${mode.label}",
            style = PomoTypography.titleMedium,
            color = getModeColor(mode),
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun TimerDisplay(
    timeLeftSeconds: Int,
    mode: PomodoroMode
) {
    val minutes = timeLeftSeconds / 60
    val seconds = timeLeftSeconds % 60
    val timeString = "%02d:%02d".format(minutes, seconds)
    val modeColor = getModeColor(mode)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(8.dp, RoundedCornerShape(12.dp))
            .background(PomoColors.PanelBackground, RoundedCornerShape(12.dp))
            .border(4.dp, PomoColors.Shadow, RoundedCornerShape(12.dp))
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = timeString,
            style = PomoTypography.titleLarge.copy(
                fontSize = 56.sp,
                color = modeColor,
                shadow = androidx.compose.ui.graphics.Shadow(
                    color = modeColor.copy(alpha = 0.5f),
                    blurRadius = 20f
                )
            )
        )
    }
}

@Composable
fun ProgressBar(
    progress: Float,
    mode: PomodoroMode
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(12.dp)
            .shadow(2.dp, RoundedCornerShape(6.dp))
            .background(PomoColors.Shadow, RoundedCornerShape(6.dp))
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(progress)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            getModeColor(mode),
                            getModeColor(mode).copy(alpha = 0.7f)
                        )
                    ),
                    RoundedCornerShape(6.dp)
                )
        )
    }
}

@Composable
fun PomodoroControls(
    isRunning: Boolean,
    onStartPause: () -> Unit,
    onEnd: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        PixelButton(
            text = if (isRunning) "Pause" else "Start",
            onClick = onStartPause,
            backgroundColor = if (isRunning) PomoColors.Warning else PomoColors.AccentPrimary,
            modifier = Modifier.weight(1f)
        )

        PixelButton(
            text = "End",
            onClick = onEnd,
            backgroundColor = PomoColors.Danger,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun ModeSwitcher(
    currentMode: PomodoroMode,
    onModeChange: (PomodoroMode) -> Unit,
    isRunning: Boolean
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        PomodoroMode.values().forEach { mode ->
            PixelButton(
                text = mode.label.split(" ").first(),
                onClick = { onModeChange(mode) },
                backgroundColor = if (currentMode == mode) {
                    getModeColor(mode)
                } else {
                    PomoColors.PanelSecondary
                },
                textColor = if (currentMode == mode) {
                    PomoColors.BackgroundPrimary
                } else {
                    PomoColors.TextPrimary
                },
                enabled = !isRunning,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun DurationSelector(
    selectedDuration: Int,
    onDurationChange: (Int) -> Unit
) {
    val durations = listOf(25, 35, 40, 50)

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Work Duration",
            style = PomoTypography.labelMedium,
            color = PomoColors.TextMuted
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            durations.forEach { duration ->
                PixelButton(
                    text = "${duration}m",
                    onClick = { onDurationChange(duration) },
                    backgroundColor = if (selectedDuration == duration) {
                        PomoColors.AccentPrimary
                    } else {
                        PomoColors.PanelSecondary
                    },
                    textColor = if (selectedDuration == duration) {
                        PomoColors.BackgroundPrimary
                    } else {
                        PomoColors.TextPrimary
                    },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
fun PomodoroStats(
    completedPomodoros: Int,
    sessionNumber: Int
) {
    PixelPanel {
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "📊 Stats",
                style = PomoTypography.titleMedium,
                color = PomoColors.AccentPrimary
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Completed",
                        style = PomoTypography.bodyMedium,
                        color = PomoColors.TextMuted
                    )
                    Text(
                        text = completedPomodoros.toString(),
                        style = PomoTypography.titleMedium.copy(fontSize = 24.sp),
                        color = PomoColors.AccentPrimary
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Session",
                        style = PomoTypography.bodyMedium,
                        color = PomoColors.TextMuted
                    )
                    Text(
                        text = "#$sessionNumber",
                        style = PomoTypography.titleMedium.copy(fontSize = 24.sp),
                        color = PomoColors.Warning
                    )
                }
            }
        }
    }
}

@Composable
fun WeeklyStatsCard(weeklyStats: com.example.pomotodo.data.model.WeeklyStats) {
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

    PixelPanel {
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "📊 This Week",
                style = PomoTypography.titleMedium,
                color = PomoColors.AccentPrimary
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                weeklyStats.days.forEachIndexed { index, minutes ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = days[index],
                            style = PomoTypography.labelSmall,
                            color = PomoColors.TextMuted
                        )
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(
                                    if (minutes > 0) PomoColors.AccentPrimary else PomoColors.PanelSecondary,
                                    RoundedCornerShape(4.dp)
                                )
                                .border(2.dp, PomoColors.Shadow, RoundedCornerShape(4.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = minutes.toString(),
                                style = PomoTypography.labelSmall.copy(fontSize = 8.sp),
                                color = if (minutes > 0) PomoColors.BackgroundPrimary else PomoColors.TextMuted
                            )
                        }
                    }
                }
            }

            // Total
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(4.dp, RoundedCornerShape(6.dp))
                    .background(PomoColors.AccentPrimary.copy(alpha = 0.1f), RoundedCornerShape(6.dp))
                    .border(2.dp, PomoColors.AccentPrimary, RoundedCornerShape(6.dp))
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Total: ${weeklyStats.formatTotal()}",
                    style = PomoTypography.titleMedium,
                    color = PomoColors.AccentPrimary
                )
            }
        }
    }
}

private fun getModeColor(mode: PomodoroMode): Color {
    return when (mode) {
        PomodoroMode.WORK -> PomoColors.AccentPrimary
        PomodoroMode.SHORT_BREAK -> PomoColors.Warning
        PomodoroMode.LONG_BREAK -> PomoColors.Danger
    }
}

private fun calculateProgress(timeLeft: Int, mode: PomodoroMode, workDuration: Int): Float {
    val totalTime = mode.getDuration(workDuration)
    return if (totalTime > 0) {
        (totalTime - timeLeft).toFloat() / totalTime
    } else {
        0f
    }
}