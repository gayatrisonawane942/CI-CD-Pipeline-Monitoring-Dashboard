let data = [];
let auto = true;
let doughnutChart, lineChart;

function randomBuild() {
    const pipelines = ["Frontend", "Backend", "Deployment"];
    const statuses = ["Success", "Failure", "Running"];

    return {
        id: data.length + 1,
        pipeline: pipelines[Math.floor(Math.random()*3)],
        status: statuses[Math.floor(Math.random()*3)],
        time: new Date().toLocaleTimeString()
    };
}

function update() {
    if (!auto) return;

    const build = randomBuild();
    data.push(build);

    if (build.status === "Failure") alert("🚨 Build Failed!");

    render();
    updateLogs(build);
    simulateProgress();
}

function render() {
    let success = data.filter(d=>d.status==="Success").length;
    let failure = data.filter(d=>d.status==="Failure").length;
    let running = data.filter(d=>d.status==="Running").length;

    document.getElementById("success").innerText = success;
    document.getElementById("failure").innerText = failure;
    document.getElementById("running").innerText = running;

    let filter = document.getElementById("filter").value;
    let search = document.getElementById("search").value.toLowerCase();

    let filtered = data.filter(d =>
        (filter==="All" || d.status===filter) &&
        d.pipeline.toLowerCase().includes(search)
    );

    document.getElementById("table").innerHTML =
        filtered.map(d=>`
        <tr>
            <td>${d.id}</td>
            <td>${d.status}</td>
            <td>${d.pipeline}</td>
            <td>${d.time}</td>
        </tr>`).join("");

    renderCharts(success, failure);
}

function renderCharts(success, failure) {
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    doughnutChart = new Chart(document.getElementById("doughnut"), {
        type: 'doughnut',
        data: {
            labels: ['Success', 'Failure'],
            datasets: [{ data: [success, failure] }]
        }
    });

    lineChart = new Chart(document.getElementById("line"), {
        type: 'line',
        data: {
            labels: data.map(d=>d.id),
            datasets: [{
                label: 'Build Trend',
                data: data.map(d=>d.status==="Success"?1:0),
                fill: false
            }]
        }
    });
}

function updateLogs(build) {
    const logs = document.getElementById("logs");
    logs.innerText += `[${build.time}] ${build.pipeline} - ${build.status}\n`;
}

function simulateProgress() {
    let bar = document.getElementById("progress");
    let progress = 0;

    let interval = setInterval(()=>{
        progress += 10;
        bar.style.width = progress + "%";
        if (progress >= 100) clearInterval(interval);
    }, 200);
}

function toggleAuto() {
    auto = !auto;
}

setInterval(update, 3000);