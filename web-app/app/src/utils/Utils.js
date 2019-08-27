
let monthArray = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

exports.renderDate = (date) => {
    let hours = date && date.getHours() >= 0
        ? date.getHours().toString().padStart(2,"0")
        : undefined
    let minutes = date && date.getMinutes() >= 0
        ? date.getMinutes().toString().padStart(2,"0")
        : undefined
    let displayTime = hours && minutes
        ? hours + ":" + minutes
        : undefined
    let displayDate = date && date.getDate() && date.getMonth() && date.getFullYear()
        ? date.getDate() + " " + monthArray[date.getMonth()] + " " + date.getFullYear()
        : undefined
    return displayDate && displayTime
        ? displayDate + " - " + displayTime
        : "Data e orario non specificati"
}

exports.dummyLinkedUserList = [{
    _id: "ciao11",
    name: "Francesco Manara",
    address: { city: "Ravenna"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao2",
    name: "Luca Giurato",
    address: { city: "Milano"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao3",
    name: "Grant Gustin",
    address: { city: "Los Angeles"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao4",
    name: "Mimmo Calabro",
    address: { city: "Catanzaro"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Charles Leclerc",
    address: { city: "Montecarlo"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Ferrari",
    address: { city: "Maranello"},
    organization: true,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "McLaren",
    address: { city: "Woking"},
    organization: true,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Francesco Grandinetti",
    address: { city: "Imola"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Andrea Giannini",
    address: { city: "Rimini"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Simone Gollinucci",
    address: { city: "Riccione"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "ciao5",
    name: "Sasuke Uchiha",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}, {
    _id: "my_id",
    name: "Ciccio maliccio",
    address: { city: "Konoha"},
    organization: false,
    avatar: "gatto.jpeg"
}]

exports.dummyLoggedUser = {
    _id: "my_id",
    linkedUsers: exports.dummyLinkedUserList,
    name: "Francesco",
    surname: "Grandinetti",
    organization: false,
    gender: "Male",
    birthdate: "1996-04-27",
    phone: "3474864891",
    email: "francesco.grandinett@gmail.com",
    avatar: "gatto.jpeg",
    groups: [],
    badges: [],
    points: 27,
    nReviewDone: 15,
    nReviewReceived: 0,
    eventsSubscribed: [],
    eventsFollowed: [],
    address: {
        address: { city: "Imola"}
    }
}