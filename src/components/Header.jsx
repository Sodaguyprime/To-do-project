import {styles} from "../styles.js";

const Header = ({todos}) => {

    return (<header style={styles.header}>
        <h1 style={styles.title}>Todos </h1>
        <div style={styles.countChip}> {todos.filter(t => !t.done).length} Tasks Left</div>
    </header>)
}
export default Header;