document.addEventListener("DOMContentLoaded", function () {

    console.log("Halaman bilik suara berhasil dimuat.");

    // ==========================================
    // AMBIL DATA PEMILIH
    // ==========================================

    const voterData =
        localStorage.getItem(
            STORAGE_KEYS.CURRENT_VOTER
        );

    if (!voterData) {

        alert(
            "Sesi pemilih tidak ditemukan. Silakan login terlebih dahulu."
        );

        window.location.replace("login.html");

        return;
    }


    let currentVoter;

    try {

        currentVoter = JSON.parse(voterData);

    } catch (error) {

        console.error(
            "Data pemilih rusak:",
            error
        );

        localStorage.removeItem(
            STORAGE_KEYS.CURRENT_VOTER
        );

        window.location.replace("login.html");

        return;
    }


    // ==========================================
    // CEK DATA PEMILIH
    // ==========================================

    if (
        !currentVoter.id ||
        !currentVoter.nama ||
        !currentVoter.kelas
    ) {

        localStorage.removeItem(
            STORAGE_KEYS.CURRENT_VOTER
        );

        window.location.replace("login.html");

        return;
    }


    // ==========================================
    // CEK SUDAH MEMILIH
    // ==========================================

    if (hasStudentVoted(currentVoter.id)) {

        localStorage.removeItem(
            STORAGE_KEYS.CURRENT_VOTER
        );

        window.location.replace("sukses.html");

        return;
    }


    // ==========================================
    // INFORMASI PEMILIH
    // ==========================================

    const pemilihInfo =
        document.getElementById("pemilihInfo");

    if (pemilihInfo) {

        pemilihInfo.innerHTML = `
            <div class="font-bold">
                ${escapeHTML(currentVoter.nama)}
            </div>

            <div class="text-blue-100">
                ${escapeHTML(currentVoter.kelas)}
            </div>
        `;
    }


    // ==========================================
    // CONTAINER PASLON
    // ==========================================

    const container =
        document.getElementById("paslonContainer");

    if (!container) {

        console.error(
            "Elemen paslonContainer tidak ditemukan."
        );

        return;
    }


    // ==========================================
    // RENDER 3 PASLON
    // ==========================================

    container.innerHTML = "";


    PASLON.forEach(function (paslon) {

        const card =
            document.createElement("div");

        card.className =
            "paslon-card-full";

        card.dataset.id =
            paslon.id;


        card.innerHTML = `

            <div class="selected-badge-full">
                ✓ PILIHAN ANDA
            </div>

            <div class="nomor-badge-full">
                ${paslon.nomor}
            </div>

            <div class="paslon-photo-wrapper">

                <img
                    src="${paslon.foto}"
                    alt="Foto Paslon ${paslon.nomor}"
                    class="paslon-photo-full"
                    onerror="
                        this.onerror=null;
                        this.src='https://placehold.co/800x900/1e3a8a/ffffff?text=PASLON+${paslon.nomor}'
                    "
                >

            </div>

            <div class="paslon-info-full">

                <p class="paslon-label">
                    PASANGAN CALON
                </p>

                <h3 class="paslon-title-full">
                    ${escapeHTML(paslon.ketua)}
                </h3>

                <div class="paslon-divider">
                    &
                </div>

                <h4 class="paslon-wakil-full">
                    ${escapeHTML(paslon.wakil)}
                </h4>

                <div class="paslon-number-box">

                    <span>
                        NOMOR URUT
                    </span>

                    <strong>
                        ${paslon.nomor}
                    </strong>

                </div>

                <button
                    type="button"
                    class="choose-paslon-btn"
                >
                    Pilih Paslon ${paslon.nomor}
                </button>

            </div>
        `;


        card.addEventListener(
            "click",
            function () {

                selectPaslon(paslon.id);

            }
        );


        container.appendChild(card);

    });


    // ==========================================
    // VARIABEL PILIHAN
    // ==========================================

    let selectedPaslon = null;


    // ==========================================
    // PILIH PASLON
    // ==========================================

    function selectPaslon(id) {

        selectedPaslon = id;


        document
            .querySelectorAll(".paslon-card-full")
            .forEach(function (card) {

                card.classList.remove(
                    "selected-full"
                );

            });


        const selectedCard =
            document.querySelector(
                `.paslon-card-full[data-id="${id}"]`
            );


        if (selectedCard) {

            selectedCard.classList.add(
                "selected-full"
            );

        }


        const paslon =
            PASLON.find(function (item) {

                return item.id === id;

            });


        if (!paslon) {
            return;
        }


        const submitButton =
            document.getElementById(
                "submitVote"
            );


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.classList.remove(
                "bg-slate-400",
                "cursor-not-allowed"
            );

            submitButton.classList.add(
                "bg-blue-600",
                "hover:bg-blue-700",
                "cursor-pointer"
            );

        }


        const selectedText =
            document.getElementById(
                "selectedText"
            );


        if (selectedText) {

            selectedText.textContent =
                `✓ Anda memilih Paslon ${paslon.nomor}`;

        }

    }


    // ==========================================
    // TOMBOL KONFIRMASI
    // ==========================================

    const submitVote =
        document.getElementById(
            "submitVote"
        );


    if (submitVote) {

        submitVote.addEventListener(
            "click",
            function () {

                if (!selectedPaslon) {

                    alert(
                        "Silakan pilih salah satu Paslon."
                    );

                    return;
                }


                const paslon =
                    PASLON.find(function (item) {

                        return (
                            item.id ===
                            selectedPaslon
                        );

                    });


                if (!paslon) {
                    return;
                }


                const confirmPaslon =
                    document.getElementById(
                        "confirmPaslon"
                    );


                if (confirmPaslon) {

                    confirmPaslon.innerHTML = `

                        <div class="flex items-center gap-4">

                            <img
                                src="${paslon.foto}"
                                class="w-20 h-20 object-cover rounded-xl"
                                alt="Paslon ${paslon.nomor}"
                            >

                            <div class="text-left">

                                <p class="text-sm text-slate-500">
                                    Pilihan Anda
                                </p>

                                <p class="text-xl font-bold text-blue-700">
                                    Paslon ${paslon.nomor}
                                </p>

                                <p class="text-sm text-slate-600">
                                    ${escapeHTML(paslon.ketua)}
                                    &
                                    ${escapeHTML(paslon.wakil)}
                                </p>

                            </div>

                        </div>
                    `;
                }


                const modal =
                    document.getElementById(
                        "confirmModal"
                    );


                if (modal) {

                    modal.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }


    // ==========================================
    // BATAL
    // ==========================================

    const cancelConfirm =
        document.getElementById(
            "cancelConfirm"
        );


    if (cancelConfirm) {

        cancelConfirm.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "confirmModal"
                    )
                    .classList.add(
                        "hidden"
                    );

            }
        );

    }


    // ==========================================
    // KIRIM SUARA
    // ==========================================

    const finalSubmit =
        document.getElementById(
            "finalSubmit"
        );


    if (finalSubmit) {

        finalSubmit.addEventListener(
            "click",
            function () {

                if (!selectedPaslon) {
                    return;
                }


                /*
                 * Cek ulang supaya tidak double vote
                 */

                if (
                    hasStudentVoted(
                        currentVoter.id
                    )
                ) {

                    alert(
                        "Anda sudah menggunakan hak pilih."
                    );

                    window.location.replace(
                        "sukses.html"
                    );

                    return;
                }


                const votes =
                    getVotes();


                const newVote = {

                    id:
                        "VOTE-" +
                        Date.now(),

                    studentId:
                        currentVoter.id,

                    paslonId:
                        selectedPaslon,

                    timestamp:
                        new Date().toISOString()

                };


                votes.push(newVote);


                saveVotes(votes);


                // Simpan pilihan terakhir

                localStorage.setItem(
                    STORAGE_KEYS.LAST_VOTE,
                    JSON.stringify({
                        paslonId:
                            selectedPaslon,

                        timestamp:
                            newVote.timestamp
                    })
                );


                // Hapus sesi

                localStorage.removeItem(
                    STORAGE_KEYS.CURRENT_VOTER
                );


                // Ke halaman sukses

                window.location.replace(
                    "sukses.html"
                );

            }
        );

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }

});
