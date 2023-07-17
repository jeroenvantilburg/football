input.onButtonPressed(Button.A, function () {
    led.stopAnimation()
    basic.clearScreen()
    team = 1
    xPlayer = 2
    xOffset = 0
})
radio.onReceivedValue(function (coordinate, value) {
    if (coordinate == "x") {
        xOthers = value
    } else if (coordinate == "y") {
        yOthers = value
    }
})
radio.onReceivedString(function (receivedString) {
    data = receivedString.split(":")
    xOthers = 0
    xOthers = data[1]
    yOthers = data[2]
})
input.onButtonPressed(Button.B, function () {
    led.stopAnimation()
    team = 2
    xPlayer = xMax - 2
    xOffset = xMax - 4
})
let draaien = 0
let kanteling = 0
let yPlayerPrev = 0
let xPlayerPrev = 0
let data: string[] = []
let xOffset = 0
let xPlayer = 0
let team = 0
let yOthers = 0
let xOthers = 0
let xMax = 0
xMax = 12
let yMax = 8
xOthers = xMax / 2
yOthers = yMax / 2
let yPlayer = yMax / 2
let yOffset = yPlayer - 2
let brightnessLines = 10
let brightnessPlayer = 255
let brightnessOthers = 100
radio.setGroup(1)
basic.showString("Kies A of B")
while (team == 0) {
    basic.pause(100)
}
radio.sendNumber(team)
basic.forever(function () {
    xPlayerPrev = xPlayer
    yPlayerPrev = yPlayer
    basic.pause(500)
    kanteling = input.rotation(Rotation.Pitch)
    if (kanteling < -20 && yPlayer > 0) {
        yPlayer += -1
    } else if (kanteling > 20 && yPlayer < yMax) {
        yPlayer += 1
    }
    draaien = input.rotation(Rotation.Roll)
    if (draaien < -20 && xPlayer > 0) {
        xPlayer += -1
    } else if (draaien > 20 && xPlayer < xMax) {
        xPlayer += 1
    }
    // check for collision with other players
    if (xPlayer == xOthers && yPlayer == yOthers) {
        xPlayer = xPlayerPrev
        yPlayer = yPlayerPrev
    }
    // determine viewport
    if (xPlayer - xOffset < 2 && xOffset > 0) {
        xOffset += -1
    }
    if (yPlayer - yOffset < 2 && yOffset > 0) {
        yOffset += -1
    }
    if (xPlayer - xOffset > 2 && xOffset < xMax - 4) {
        xOffset += 1
    }
    if (yPlayer - yOffset > 2 && yOffset < yMax - 4) {
        yOffset += 1
    }
    radio.sendValue("x", xPlayer)
    radio.sendValue("y", yPlayer)
    radio.sendString("" + convertToText(team) + ":" + convertToText(xPlayer) + ":" + convertToText(yPlayer))
    basic.clearScreen()
    for (let x = 0; x <= xMax; x++) {
        led.plotBrightness(x - xOffset, 0 - yOffset, brightnessLines)
        led.plotBrightness(x - xOffset, yMax - yOffset, brightnessLines)
    }
    for (let y = 0; y <= yMax; y++) {
        led.plotBrightness(0.5 * xMax - xOffset, y - yOffset, brightnessLines)
        if (y != yMax / 2) {
            led.plotBrightness(0 - xOffset, y - yOffset, brightnessLines)
            led.plotBrightness(xMax - xOffset, y - yOffset, brightnessLines)
        }
    }
    led.plotBrightness(xPlayer - xOffset, yPlayer - yOffset, brightnessPlayer)
    led.plotBrightness(xOthers - xOffset, yOthers - yOffset, brightnessOthers)
    if (team == 1 && (xPlayer == xMax && yPlayer == yMax / 2)) {
        game.gameOver()
    } else if (team == 2 && (xPlayer == 0 && yPlayer == yMax / 2)) {
        game.gameOver()
    }
})
