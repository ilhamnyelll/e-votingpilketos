document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    if (!form) {
        console.error("Form login tidak ditemukan.");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const namaInput = document.getElementById("nama");
        const kelasInput = document.getElementById("kelas");

        if (!namaInput || !kelasInput) {
            showError("Input nama atau kelas tidak ditemukan.");
            return;
        }

        const nama = namaInput.value.trim();
        const kelas = kelasInput.value;

        errorBox.classList.add("hidden");
        errorBox.textContent = "";

        if (nama === "") {
            showError("Nama lengkap wajib diisi.");
            namaInput.focus();
            return;
        }

        if (kelas === "") {
            showError("Silakan pilih kelas.");
            kelasInput.focus();
            return;
        }

        /*
         * Cari siswa
         */

        let student = findStudent(nama, kelas);

        /*
         * Untuk demo:
         * Jika belum ada di daftar, buat siswa baru.
         */

        if (!student) {

            const students = getStudents();

            student = {
                id: "S" + Date.now(),
                nama: nama,
                kelas: kelas
            };

            students.push(student);

            saveStudents(students);
        }

        /*
         * Cek apakah sudah memilih
         */

        if (hasStudentVoted(student.id)) {

            showError(
                "Nama tersebut sudah menggunakan hak pilih."
            );

            return;
        }

        /*
         * Simpan sesi pemilih
         */

        localStorage.setItem(
            STORAGE_KEYS.CURRENT_VOTER,
            JSON.stringify(student)
        );

        /*
         * Masuk ke bilik suara
         */

        window.location.replace("voting.html");

    });


    function showError(message) {

        errorBox.textContent = message;

        errorBox.classList.remove("hidden");
    }

});
