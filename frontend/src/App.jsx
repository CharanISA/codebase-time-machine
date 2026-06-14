import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./App.css";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyzeRepo() {
    setLoading(true);
    setData(null);

    const response = await fetch(
      `http://127.0.0.1:8000/analyze?repo_url=${encodeURIComponent(repoUrl)}`
    );

    const result = await response.json();
    setData(result);
    setLoading(false);
  }

  return (
    <div className="app">
      <section className="hero">
        <h1>Codebase Time Machine</h1>
        <p>Explore how a software project evolved through commits, contributors, and file changes.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter public GitHub repo URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button onClick={analyzeRepo}>Analyze Repo</button>
        </div>
      </section>

      {loading && <p className="loading">Analyzing repository...</p>}

      {data && (
        <div className="dashboard">
          <h2>{data.repo_name}</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Commits</span>
              <strong>{data.total_commits}</strong>
            </div>

            <div className="stat-card">
              <span>Contributors</span>
              <strong>{data.total_contributors}</strong>
            </div>

            <div className="stat-card">
              <span>Files Changed</span>
              <strong>{data.total_files_changed}</strong>
            </div>

            <div className="stat-card">
              <span>Main Contributor</span>
              <strong>{data.insights.main_contributor}</strong>
            </div>
          </div>

          <div className="insight-card">
            <h3>Project Insight</h3>
            <p>{data.insights.summary}</p>
          </div>

          <div className="grid">
            <div className="card">
              <h3>Top Contributors</h3>
              {data.top_authors.map((author, index) => (
                <div className="row" key={index}>
                  <span>{index + 1}. {author[0]}</span>
                  <strong>{author[1]} commits</strong>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>Most Changed Files</h3>
              {data.most_changed_files.map((file, index) => (
                <div className="row" key={index}>
                  <span>{index + 1}. {file[0]}</span>
                  <strong>{file[1]} changes</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Commit Timeline</h3>

            {data.timeline.map((commit, index) => (
              <div className="commit-card" key={index}>
                <div className="commit-top">
                  <strong>{commit.hash}</strong>
                  <span>{new Date(commit.date).toLocaleDateString()}</span>
                </div>

                <p>{commit.message}</p>
                <small>By {commit.author}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;