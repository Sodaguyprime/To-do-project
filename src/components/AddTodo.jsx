import {styles} from "../styles.js";

const AddTodo = ({onSubmit, setText, text}) => {
    return (
        <>
            <form style={styles.toolbar} onSubmit={onSubmit}>
                <div style={styles.field}>
                    <input
                        style={styles.input}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type in your To-do"
                        inputMode="text"
                        autoComplete="off"
                    />
                    <button type="submit" style={styles.btnPrimary} aria-label="Add todo">+</button>
                </div>
            </form>

        </>
    )
}
export default AddTodo