# 🍅 POMOTODO

A pixel-art styled productivity app combining **Todo List Management** with the **Pomodoro Technique** for focused work sessions.

🔗 **Live Demo**: [https://to-dos-private.netlify.app/](https://to-dos-private.netlify.app/)

---

## ✨ Features

### 📝 Todo Management
- **Add todos** with a clean, retro interface
- **Priority levels**: Low (Green) → Medium (Yellow) → High (Red)
- **Filter tasks**: View All, Active, or Completed todos
- **Edit & Delete**: Click any todo to reveal edit/delete actions
- **Auto-sort**: Tasks automatically organized by priority (High → Medium → Low)
- **Persistent storage**: Your todos are saved locally and persist across sessions

### 🍅 Pomodoro Timer
- **Flexible work sessions**: Choose from 25, 35, 40, or 50-minute focus periods
- **Smart breaks**: Automatic 5-minute short breaks and 15-minute long breaks
- **Session tracking**: Track completed pomodoros and current session number
- **Visual progress**: Animated progress bar with color-coded modes
- **Weekly statistics**: Monitor your study time across the entire week
- **Audio notifications**: Subtle beep alerts when timers complete

### 🎨 Design Highlights
- **Pixel-art aesthetic** with Press Start 2P and VT323 fonts
- **Dark theme** optimized for reduced eye strain
- **Color-coded priorities** for quick visual scanning
- **Responsive layout** optimized for both desktop and mobile
- **Performance optimized** with React memoization for smooth mobile experience

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pomotodo.git

# Navigate to project directory
cd pomotodo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🎮 How to Use

### Todo List
1. **Add a Task**: Type your todo in the input field and click the `+` button
2. **Set Priority**: While typing, click the priority button (L/M/H) to cycle through priority levels
3. **Complete Tasks**: Click the checkbox to mark todos as done
4. **Edit/Delete**: Click on any todo text to reveal edit and delete buttons
5. **Filter View**: Use All/Active/Done buttons to filter your task list
6. **Clear Completed**: Click the "Clear" button to remove all completed tasks

### Pomodoro Timer
1. **Select Duration**: Choose your preferred work session length (25/35/40/50 minutes)
2. **Start Timer**: Click "START" to begin your focus session
3. **Take Breaks**: Timer automatically switches to break mode after each work session
4. **Track Progress**: View your completed pomodoros and weekly study statistics
5. **Mode Switching**: Manually switch between WORK/BREAK/LONG modes using the bottom buttons

---

## 🛠️ Tech Stack

- **React** (with Hooks)
- **Vite** (Build tool)
- **localStorage** (Data persistence)
- **CSS-in-JS** (Inline styles)
- **Google Fonts** (Press Start 2P, VT323)

---

## 📂 Project Structure

```
pomotodo/
├── src/
│   ├── components/
│   │   ├── AddTodo.jsx          # Todo input with priority selector
│   │   ├── ListTodos.jsx        # Todo list container
│   │   ├── TodoCard.jsx         # Individual todo item
│   │   ├── Header.jsx           # App header with tabs
│   │   ├── Footer.jsx           # Filter and clear controls
│   │   ├── Pomodoro.jsx         # Pomodoro timer component
│   │   └── weekly-stats-component.jsx  # Weekly study tracker
│   ├── App.jsx                  # Main app component
│   ├── styles.js                # Centralized styles
│   └── main.jsx                 # Entry point
├── public/
│   ├── Pomotodo.png            # App logo
│   ├── task.png                # Todo tab icon
│   └── Pixelated-tomato.png    # Pomodoro tab icon
└── README.md
```

---

## 🎯 Key Features Explained

### Priority System
- **Low (Green)**: Regular tasks
- **Medium (Yellow)**: Important tasks
- **High (Red)**: Urgent tasks
- Tasks automatically sort with highest priority at the top

### Pomodoro Technique
Based on the proven time management method:
1. Work for 25-50 minutes (you choose!)
2. Take a 5-minute short break
3. After 4 work sessions, take a 15-minute long break
4. Repeat for maximum productivity

### Weekly Statistics
- Tracks study time for each day of the week (Mon-Sun)
- Displays total weekly study hours
- Automatically resets each week
- Persists data in localStorage

---

## ⚡ Performance Optimizations

- **React.memo()** on TodoItem components to prevent unnecessary re-renders
- **useMemo()** for filtered todos and active count calculations
- **Optimized sorting** performed once on load rather than every render
- **Memoized callbacks** to reduce prop changes
- **Mobile-first optimization** for smooth performance on all devices

---

## 🎨 Customization

### Changing Colors
Edit `styles.js` to customize the color scheme:
- `#66ffc4` - Primary green (low priority, success)
- `#ffd166` - Warning yellow (medium priority)
- `#ff6b6b` - Danger red (high priority)
- `#222734` - Dark background
- `#2b3242` - Panel background

### Adjusting Timer Durations
In `Pomodoro.jsx`, modify:
```javascript
const SHORT_BREAK = 5 * 60  // 5 minutes
const LONG_BREAK = 15 * 60  // 15 minutes
const WORK_DURATIONS = [25, 35, 40, 50]  // Work session options
```

---

## 🐛 Known Issues

- Weekly stats reset logic could be improved for edge cases around midnight
- No dark/light theme toggle (dark theme only)
- No cloud sync (localStorage only)

---

## 🚧 Future Enhancements

- [ ] Cloud sync with user authentication
- [ ] Task categories/tags
- [ ] Custom timer durations
- [ ] Sound customization options
- [ ] Export/import todo lists
- [ ] Recurring tasks
- [ ] Task notes and subtasks
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Desktop notifications

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- Pixel art design inspiration from retro gaming aesthetics
- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38
- Font: [VT323](https://fonts.google.com/specimen/VT323) by Peter Hull

---

## 📧 Contact

For questions, suggestions, or bug reports, please open an issue on GitHub.

**Made with ❤️ and lots of ☕ using the Pomodoro Technique**

---

⭐ If you find this project helpful, please consider giving it a star on GitHub!