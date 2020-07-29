const socket = io()

const form = document.querySelector('#form')
const input = form.querySelector('input')
const button = form.querySelector('button')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // store the last message in a variable
    const newMessage = messages.lastElementChild

    // get the total height of the new message + styles height
    // get access to the styles applied in the new message
    const newMessageStyles = getComputedStyle(newMessage)
    // get the int value of the style to add in the new message height
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    // add styles value and new message height
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin


    // get the height of all the messages
    const visibleHeight = messages.offsetHeight

    // get the total height of the container
    const containerHeight = messages.scrollHeight

    // calculate how much scrolled the user is
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationMessageTemplate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    button.disabled = true

    const userInput = event.target.elements.message.value

    socket.emit('sendMessage', userInput, (error) => {
        button.disabled = false
        input.value = ''
        input.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered.')
    })
})

const sendLocation = document.querySelector('#send-location')

sendLocation.addEventListener('click', (event) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    sendLocation.disabled = true

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocation.disabled = false

            console.log('Location shared.')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        location.href = '/'
        alert(error)
    }
})