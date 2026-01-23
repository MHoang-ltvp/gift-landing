import LeadForm from "./components/LeadForm";

export default function Home() {
    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <h1>Gift Landing</h1>
            <p>3 line: Tết · Valentine · 8/3</p>

            <LeadForm />
        </main>
    );
}
