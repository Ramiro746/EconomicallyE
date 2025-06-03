import FixedExpense from './FixedExpense';
import VariableExpense from './VariableExpense';
import Goal from './Goal';
import Overview from './Overview';

export default function Dashboard({ userId }) {
    return (
        <div>
            <h1>Panel de Finanzas</h1>
            <Overview userId={userId} />

            <section style={{ marginTop: '2rem' }}>
                <FixedExpense userId={userId} />
                <VariableExpense userId={userId} />
                <Goal userId={userId} />
            </section>
        </div>
    );
}
