import { useState, useEffect } from "react";

export default function App() {
  const [salary, setSalary] = useState(0);
  const [emis, setEmis] = useState([]);
  const [emiName, setEmiName] = useState("");
  const [emiAmount, setEmiAmount] = useState("");
  const [emiMonths, setEmiMonths] = useState("");

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emiData"));
    if (saved) {
      setSalary(saved.salary || 0);
      setEmis(saved.emis || []);
    }
  }, []);

  // Save data automatically
  useEffect(() => {
    localStorage.setItem("emiData", JSON.stringify({ salary, emis }));
  }, [salary, emis]);

  const addEmi = () => {
    if (!emiName || !emiAmount || !emiMonths) return;
    setEmis([
      ...emis,
      {
        name: emiName,
        amount: Number(emiAmount),
        months: Number(emiMonths),
      },
    ]);
    setEmiName("");
    setEmiAmount("");
    setEmiMonths("");
  };

  const deleteEmi = (index) => {
    setEmis(emis.filter((_, i) => i !== index));
  };

  const totalEmi = emis.reduce((sum, e) => sum + e.amount, 0);
  const emiPercent =
    salary > 0 ? ((totalEmi / salary) * 100).toFixed(1) : 0;

  let status = "SAFE";
  if (emiPercent > 55) status = "DANGER";
  else if (emiPercent > 40) status = "RISK";

  const savingsSuggestion =
    salary > totalEmi ? Math.round((salary - totalEmi) * 0.2) : 0;

  return (
    <div style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Roshan EMI Manager</h2>

      <div>
        <label>Monthly Salary</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>

      <h3>Add EMI</h3>
      <input
        placeholder="EMI Name (Car / Personal / CC)"
        value={emiName}
        onChange={(e) => setEmiName(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <input
        placeholder="EMI Amount"
        type="number"
        value={emiAmount}
        onChange={(e) => setEmiAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <input
        placeholder="Months Left"
        type="number"
        value={emiMonths}
        onChange={(e) => setEmiMonths(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={addEmi} style={{ width: "100%" }}>
        Add EMI
      </button>

      <h3>Your EMIs</h3>
      {emis.map((emi, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: 8,
            marginBottom: 5,
          }}
        >
          <strong>{emi.name}</strong>
          <br />
          ₹{emi.amount} / month
          <br />
          ⏳ {emi.months} months left
          <br />
          <button onClick={() => deleteEmi(i)}>Delete</button>
        </div>
      ))}

      <hr />

      <p>
        <strong>Total EMI:</strong> ₹{totalEmi}
      </p>
      <p>
        <strong>EMI % of Salary:</strong> {emiPercent}%
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Suggested Monthly Savings:</strong> ₹{savingsSuggestion}
      </p>
    </div>
  );
}
