const users = []

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate
    if (!username || !room) {
        return {
            error: 'Username and room are required.'
        }
    }

    // check for duplicate username
    const duplicateUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate duplicate username
    if (duplicateUser) {
        return {
            error: 'Username is already taken.'
        }
    }

    // store user in array
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })

    return user
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => {
        return user.room === room
    })

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}