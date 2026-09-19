const ADMIN_PASSWORD = "admin123";

const PASLON = [
    {
        id: 1,
        nomor: 1,
        ketua: "Nama Ketua 1",
        wakil: "Nama Wakil 1",
        foto: "image/paslon1.png"
    },
    {
        id: 2,
        nomor: 2,
        ketua: "Nama Ketua 2",
        wakil: "Nama Wakil 2",
        foto: "image/paslon2.png"
    },
    {
        id: 3,
        nomor: 3,
        ketua: "Nama Ketua 3",
        wakil: "Nama Wakil 3",
        foto: "image/paslon3.png"
    }
];

const STORAGE_KEYS = {
    STUDENTS: "osis_students",
    VOTES: "osis_votes",
    CURRENT_VOTER: "osis_current_voter",
    LAST_VOTE: "osis_last_vote"
};

const DEFAULT_STUDENTS = [
    {
        id: "S001",
        nama: "Ahmad Rizky",
        kelas: "X IPA 1"
    },
    {
        id: "S002",
        nama: "Budi Santoso",
        kelas: "X IPA 1"
    },
    {
        id: "S003",
        nama: "Citra Lestari",
        kelas: "X IPA 2"
    },
    {
        id: "S004",
        nama: "Dinda Putri",
        kelas: "X IPA 2"
    },
    {
        id: "S005",
        nama: "Eko Pratama",
        kelas: "XI IPA 1"
    },
    {
        id: "S006",
        nama: "Fajar Hidayat",
        kelas: "XI IPA 1"
    },
    {
        id: "S007",
        nama: "Gita Permata",
        kelas: "XI IPS 1"
    },
    {
        id: "S008",
        nama: "Hendra Wijaya",
        kelas: "XI IPS 1"
    },
    {
        id: "S009",
        nama: "Intan Sari",
        kelas: "XII IPA 1"
    },
    {
        id: "S010",
        nama: "Joko Saputra",
        kelas: "XII IPA 1"
    }
];

function getStudents() {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);

    if (!data) {
        localStorage.setItem(
            STORAGE_KEYS.STUDENTS,
            JSON.stringify(DEFAULT_STUDENTS)
        );

        return [...DEFAULT_STUDENTS];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        localStorage.setItem(
            STORAGE_KEYS.STUDENTS,
            JSON.stringify(DEFAULT_STUDENTS)
        );

        return [...DEFAULT_STUDENTS];
    }
}

function saveStudents(students) {
    localStorage.setItem(
        STORAGE_KEYS.STUDENTS,
        JSON.stringify(students)
    );
}

function getVotes() {
    const data = localStorage.getItem(STORAGE_KEYS.VOTES);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveVotes(votes) {
    localStorage.setItem(
        STORAGE_KEYS.VOTES,
        JSON.stringify(votes)
    );
}

function findStudent(nama, kelas) {
    const students = getStudents();

    const namaNormal = nama.trim().toLowerCase();

    return students.find(function (student) {
        return (
            student.nama.trim().toLowerCase() === namaNormal &&
            student.kelas === kelas
        );
    });
}

function hasStudentVoted(studentId) {
    const votes = getVotes();

    return votes.some(function (vote) {
        return vote.studentId === studentId;
    });
}

function getVoteCounts() {
    const votes = getVotes();

    const counts = {
        1: 0,
        2: 0,
        3: 0
    };

    votes.forEach(function (vote) {
        if (counts[vote.paslonId] !== undefined) {
            counts[vote.paslonId]++;
        }
    });

    return counts;
}

function resetVotingData() {
    localStorage.removeItem(STORAGE_KEYS.VOTES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_VOTER);
    localStorage.removeItem(STORAGE_KEYS.LAST_VOTE);
}

getStudents();
