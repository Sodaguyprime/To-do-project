package com.example.pomotodo.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.example.pomotodo.R

// Color Palette
object PomoColors {
    val BackgroundPrimary = Color(0xFF1B1F28)
    val BackgroundSecondary = Color(0xFF171A22)
    val PanelBackground = Color(0xFF222734)
    val PanelSecondary = Color(0xFF2B3242)
    val TextPrimary = Color(0xFFE5E5E5)
    val TextMuted = Color(0xFF9AA1AC)
    val AccentPrimary = Color(0xFF66FFC4)
    val AccentSecondary = Color(0xFF4DE6A8)
    val Danger = Color(0xFFFF6B6B)
    val Warning = Color(0xFFFFD166)
    val Shadow = Color(0xFF0B0D12)

    // Priority Colors
    val PriorityLow = Color(0xFF66FFC4)
    val PriorityMedium = Color(0xFFFFD166)
    val PriorityHigh = Color(0xFFFF6B6B)
}

// Custom Fonts
val VT323FontFamily = FontFamily(
    Font(R.font.vt323_regular, FontWeight.Normal)
)

val PressStart2PFontFamily = FontFamily(
    Font(R.font.press_start_2p_regular, FontWeight.Normal)
)

// Typography
val PomoTypography = Typography(
    titleLarge = TextStyle(
        fontFamily = PressStart2PFontFamily,
        fontSize = 20.sp,
        color = PomoColors.TextPrimary
    ),
    titleMedium = TextStyle(
        fontFamily = PressStart2PFontFamily,
        fontSize = 18.sp,
        color = PomoColors.TextPrimary
    ),
    bodyLarge = TextStyle(
        fontFamily = VT323FontFamily,
        fontSize = 22.sp,
        color = PomoColors.TextPrimary
    ),
    bodyMedium = TextStyle(
        fontFamily = VT323FontFamily,
        fontSize = 20.sp,
        color = PomoColors.TextPrimary
    ),
    labelMedium = TextStyle(
        fontFamily = PressStart2PFontFamily,
        fontSize = 12.sp,
        color = PomoColors.TextPrimary
    ),
    labelSmall = TextStyle(
        fontFamily = PressStart2PFontFamily,
        fontSize = 10.sp,
        color = PomoColors.TextPrimary
    )
)

@Composable
fun getPriorityColor(priority: TodoPriority): Color {
    return when (priority) {
        TodoPriority.LOW -> PomoColors.PriorityLow
        TodoPriority.MEDIUM -> PomoColors.PriorityMedium
        TodoPriority.HIGH -> PomoColors.PriorityHigh
    }
}

enum class TodoPriority(val label: String) {
    LOW("L"),
    MEDIUM("M"),
    HIGH("H");

    fun next(): TodoPriority {
        return when (this) {
            LOW -> MEDIUM
            MEDIUM -> HIGH
            HIGH -> LOW
        }
    }
}