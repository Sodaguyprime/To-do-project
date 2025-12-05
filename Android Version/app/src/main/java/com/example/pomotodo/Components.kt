package com.example.pomotodo.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.pomotodo.R
import com.example.pomotodo.ui.theme.PomoColors
import com.example.pomotodo.ui.theme.PomoTypography

@Composable
fun PixelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    backgroundColor: Color = PomoColors.AccentPrimary,
    textColor: Color = PomoColors.BackgroundPrimary,
    enabled: Boolean = true
) {
    Box(
        modifier = modifier
            .shadow(4.dp, RoundedCornerShape(6.dp))
            .background(
                if (enabled) backgroundColor else PomoColors.PanelSecondary,
                RoundedCornerShape(6.dp)
            )
            .border(3.dp, PomoColors.Shadow, RoundedCornerShape(6.dp))
            .clickable(enabled = enabled) { onClick() }
            .padding(horizontal = 16.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = PomoTypography.labelSmall,
            color = if (enabled) textColor else PomoColors.TextMuted
        )
    }
}

@Composable
fun PixelPanel(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .shadow(6.dp, RoundedCornerShape(8.dp))
            .background(PomoColors.PanelBackground, RoundedCornerShape(8.dp))
            .border(4.dp, PomoColors.Shadow, RoundedCornerShape(8.dp))
            .padding(16.dp)
    ) {
        content()
    }
}

@Composable
fun PixelTextField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = {
            Text(
                text = placeholder,
                style = PomoTypography.bodyMedium,
                color = PomoColors.TextMuted
            )
        },
        modifier = modifier
            .background(PomoColors.PanelSecondary, RoundedCornerShape(6.dp))
            .border(3.dp, PomoColors.Shadow, RoundedCornerShape(6.dp)),
        textStyle = PomoTypography.bodyMedium.copy(color = PomoColors.TextPrimary),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = PomoColors.PanelSecondary,
            unfocusedContainerColor = PomoColors.PanelSecondary,
            focusedBorderColor = PomoColors.AccentPrimary,
            unfocusedBorderColor = Color.Transparent,
            cursorColor = PomoColors.AccentPrimary
        ),
        shape = RoundedCornerShape(6.dp)
    )
}

@Composable
fun PriorityButton(
    priority: com.example.pomotodo.ui.theme.TodoPriority,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val color = com.example.pomotodo.ui.theme.getPriorityColor(priority)

    Box(
        modifier = modifier
            .size(36.dp)
            .shadow(2.dp, RoundedCornerShape(4.dp))
            .background(color, RoundedCornerShape(4.dp))
            .border(2.dp, PomoColors.Shadow, RoundedCornerShape(4.dp))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = priority.label,
            style = PomoTypography.labelMedium,
            color = PomoColors.BackgroundPrimary
        )
    }
}

@Composable
fun Header(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    activeTodoCount: Int
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        // Title
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 16.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.pomotodo),
                contentDescription = "PomoTodo Logo",
                modifier = Modifier.size(32.dp),
                tint = Color.Unspecified
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = "PomoTodo",
                style = PomoTypography.titleLarge.copy(fontSize = 24.sp),
                color = PomoColors.AccentPrimary
            )
        }

        // Tabs
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            TabButton(
                text = "Tasks",
                icon = painterResource(id = R.drawable.task),
                isSelected = selectedTab == 0,
                onClick = { onTabSelected(0) },
                badge = if (activeTodoCount > 0) activeTodoCount else null,
                modifier = Modifier.weight(1f)
            )

            TabButton(
                text = "Pomodoro",
                icon = painterResource(id = R.drawable.pixelated_tomato),
                isSelected = selectedTab == 1,
                onClick = { onTabSelected(1) },
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun TabButton(
    text: String,
    icon: Painter,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    badge: Int? = null
) {
    Box(
        modifier = modifier
            .shadow(if (isSelected) 4.dp else 2.dp, RoundedCornerShape(6.dp))
            .background(
                if (isSelected) PomoColors.AccentPrimary else PomoColors.PanelSecondary,
                RoundedCornerShape(6.dp)
            )
            .border(
                3.dp,
                if (isSelected) PomoColors.AccentSecondary else PomoColors.Shadow,
                RoundedCornerShape(6.dp)
            )
            .clickable { onClick() }
            .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                painter = icon,
                contentDescription = text,
                modifier = Modifier.size(16.dp),
                tint = if (isSelected) PomoColors.BackgroundPrimary else PomoColors.TextPrimary
            )
            Text(
                text = text,
                style = PomoTypography.labelMedium,
                color = if (isSelected) PomoColors.BackgroundPrimary else PomoColors.TextPrimary
            )

            badge?.let { count ->
                Box(
                    modifier = Modifier
                        .background(PomoColors.Danger, RoundedCornerShape(12.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = count.toString(),
                        style = PomoTypography.labelSmall.copy(fontSize = 8.sp),
                        color = PomoColors.TextPrimary
                    )
                }
            }
        }
    }
}

@Composable
fun Footer() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(PomoColors.PanelBackground)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Made with ❤️ by you",
            style = PomoTypography.bodySmall,
            color = PomoColors.TextMuted
        )
    }
}
