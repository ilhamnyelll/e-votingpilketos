document.addEventListener("DOMContentLoaded", function () {

    const adminLogin =
        document.getElementById("adminLogin");

    const adminDashboard =
        document.getElementById("adminDashboard");

    const loginForm =
        document.getElementById("adminLoginForm");

    const adminError =
        document.getElementById("adminError");

    let voteChart = null;

    let refreshInterval = null;


    /*
     * CEK SESI ADMIN
     */

    const adminSession =
        sessionStorage.getItem("osis_admin_logged_in");


    if (adminSession === "true") {

        showDashboard();

    }


    /*
     * LOGIN ADMIN
     */

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const password =
                document
                    .getElementById("adminPassword")
                    .value;


            adminError.classList.add("hidden");


            if (password !== ADMIN_PASSWORD) {

                adminError.textContent =
                    "Password admin salah.";

                adminError.classList.remove(
                    "hidden"
                );

                return;
            }


            sessionStorage.setItem(
                "osis_admin_logged_in",
                "true"
            );


            document
                .getElementById("adminPassword")
                .value = "";


            showDashboard();

        }
    );


    /*
     * TAMPILKAN DASHBOARD
     */

    function showDashboard() {

        adminLogin.classList.add("hidden");

        adminDashboard.classList.remove(
            "hidden"
        );


        updateDashboard();


        /*
         * REFRESH OTOMATIS
         *
         * Setiap 2 detik dashboard membaca
         * localStorage kembali.
         */

        if (refreshInterval) {

            clearInterval(refreshInterval);

        }


        refreshInterval = setInterval(
            updateDashboard,
            2000
        );

    }


    /*
     * UPDATE DASHBOARD
     */

    function updateDashboard() {

        const students = getStudents();

        const votes = getVotes();

        const counts = getVoteCounts();


        /*
         * STATISTIK
         */

        const totalPemilih =
            students.length;

        const sudahMemilih =
            students.filter(
                student => hasStudentVoted(student.id)
            ).length;

        const belumMemilih =
            totalPemilih - sudahMemilih;

        const totalSuara =
            votes.length;


        document.getElementById(
            "totalPemilih"
        ).textContent = totalPemilih;


        document.getElementById(
            "sudahMemilih"
        ).textContent = sudahMemilih;


        document.getElementById(
            "belumMemilih"
        ).textContent = belumMemilih;


        document.getElementById(
            "totalSuara"
        ).textContent = totalSuara;


        /*
         * UPDATE GRAFIK
         */

        updateChart(counts);


        /*
         * UPDATE TABEL
         */

        updateStudentTable(
            students,
            votes
        );

    }


    /*
     * GRAFIK
     */

    function updateChart(counts) {

        const canvas =
            document.getElementById(
                "voteChart"
            );


        const chartData = {

            labels: [
                "Paslon 1",
                "Paslon 2",
                "Paslon 3"
            ],

            datasets: [
                {
                    label: "Jumlah Suara",

                    data: [
                        counts[1],
                        counts[2],
                        counts[3]
                    ],

                    backgroundColor: [
                        "#2563eb",
                        "#16a34a",
                        "#f59e0b"
                    ],

                    borderColor: [
                        "#1d4ed8",
                        "#15803d",
                        "#d97706"
                    ],

                    borderWidth: 1,

                    borderRadius: 8

                }
            ]

        };


        if (!voteChart) {

            voteChart = new Chart(
                canvas,
                {
                    type: "bar",

                    data: chartData,

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: false
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {
                                    precision: 0
                                }

                            }

                        }

                    }

                }
            );

        } else {

            voteChart.data = chartData;

            voteChart.update();

        }

    }


    /*
     * TABEL SISWA
     */

    function updateStudentTable(
        students,
        votes
    ) {

        const tbody =
            document.getElementById(
                "studentTable"
            );


        tbody.innerHTML = "";


        students.forEach(
            function (student, index) {


                const vote =
                    votes.find(
                        item =>
                            item.studentId ===
                            student.id
                    );


                let statusHTML = "";

                let pilihanHTML = "-";


                if (vote) {

                    statusHTML = `
                        <span class="status-voted">
                            ✓ Sudah Memilih
                        </span>
                    `;


                    const paslon =
                        PASLON.find(
                            item =>
                                item.id ===
                                vote.paslonId
                        );


                    if (paslon) {

                        pilihanHTML =
                            `Paslon ${paslon.nomor}`;

                    }

                } else {

                    statusHTML = `
                        <span class="status-not-voted">
                            Belum Memilih
                        </span>
                    `;

                }


                const row =
                    document.createElement("tr");


                row.className =
                    "table-row";


                row.innerHTML = `

                    <td class="table-cell text-center">
                        ${index + 1}
                    </td>

                    <td class="table-cell font-semibold">
                        ${escapeHTML(student.nama)}
                    </td>

                    <td class="table-cell">
                        ${escapeHTML(student.kelas)}
                    </td>

                    <td class="table-cell text-center">
                        ${statusHTML}
                    </td>

                    <td class="table-cell text-center font-semibold">
                        ${pilihanHTML}
                    </td>

                `;


                tbody.appendChild(row);

            }
        );

    }


    /*
     * LOGOUT ADMIN
     */

    document
        .getElementById("logoutAdmin")
        .addEventListener(
            "click",
            function () {

                sessionStorage.removeItem(
                    "osis_admin_logged_in"
                );


                if (refreshInterval) {

                    clearInterval(
                        refreshInterval
                    );

                }


                adminDashboard.classList.add(
                    "hidden"
                );

                adminLogin.classList.remove(
                    "hidden"
                );

            }
        );


    /*
     * RESET DATA
     */

    document
        .getElementById("resetData")
        .addEventListener(
            "click",
            function () {

                const confirmation =
                    confirm(
                        "Yakin ingin menghapus seluruh data voting?"
                    );


                if (!confirmation) {
                    return;
                }


                resetVotingData();


                alert(
                    "Data voting berhasil direset."
                );


                updateDashboard();

            }
        );


    /*
     * ESCAPE HTML
     */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});
