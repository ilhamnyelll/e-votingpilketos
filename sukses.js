document.addEventListener("DOMContentLoaded", function () {

    const lastVoteData =
        localStorage.getItem(
            STORAGE_KEYS.LAST_VOTE
        );


    const successPaslon =
        document.getElementById("successPaslon");


    if (!lastVoteData) {

        successPaslon.textContent =
            "Suara telah tercatat";

        return;
    }


    try {

        const lastVote =
            JSON.parse(lastVoteData);


        const paslon =
            PASLON.find(
                item => item.id === lastVote.paslonId
            );


        if (paslon) {

            successPaslon.textContent =
                `Paslon ${paslon.nomor}`;

        }

    } catch (error) {

        console.error(
            "Gagal membaca data voting:",
            error
        );

    }

});
