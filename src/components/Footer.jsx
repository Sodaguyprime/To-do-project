import {styles} from "../styles.js";
const Footer = ({filter, setFilter, clearDone}) => {
    return(
        <footer style={styles.footer}>
            <div style={styles.filter}>
                <button style={{...styles.btnSecondary, ...(filter==='all' ? styles.btnActive : {})}} onClick={() => setFilter('all')}>All</button>
                <button style={{...styles.btnSecondary, ...(filter==='active' ? styles.btnActive : {})}} onClick={() => setFilter('active')}>Active</button>
                <button style={{...styles.btnSecondary, ...(filter==='done' ? styles.btnActive : {})}} onClick={() => setFilter('done')}>Done</button>
            </div>
            <img 
                src="/rollingcat.gif" 
                alt="Rolling cat"
                style={{ 
                    width: '70px', 
                    height: 'auto', 
                    imageRendering: 'pixelated' 
                }}
            />
            <button style={styles.btnDanger} onClick={clearDone}>Clear</button>
        </footer>
    )
}
export default Footer;