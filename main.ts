input.onButtonPressed(Button.A, function () {
    led.stopAnimation()
    basic.clearScreen()
    team = 1
    xPlayer = 2
    xOffset = 0
})
radio.onReceivedString(function (receivedString) {
    let hadBallOthers: number[] = []
    serie_index = serienumbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))
    data = receivedString.split(":")
    if (serie_index == -1) {
        serie_index = serienumbers.length
        serienumbers.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
        teamOthers.push(parseFloat(data[0]))
        xOthers.push(parseFloat(data[1]))
        yOthers.push(parseFloat(data[2]))
        hadBallOthers.push(parseFloat(data[3]))
    } else {
        xOthers[serie_index] = parseFloat(data[1])
        yOthers[serie_index] = parseFloat(data[2])
        hadBallOthers[serie_index] = parseFloat(data[3])
    }
    if (hadBallOthers[serie_index] == waar || hadBallOthers.indexOf(waar) == -1 && hasBall == 0) {
        xBall = parseFloat(data[4])
        yBall = parseFloat(data[5])
        hasBall = 0
    }
})
input.onButtonPressed(Button.B, function () {
    led.stopAnimation()
    team = 2
    xPlayer = xMax - 2
    xOffset = xMax - 4
})
let scoreB = 0
let scored = 0
let scoreA = 0
let brightnessTemp = 0
let draaien = 0
let kanteling = 0
let yPlayerPrev = 0
let xPlayerPrev = 0
let yOthers: number[] = []
let xOthers: number[] = []
let teamOthers: number[] = []
let data: string[] = []
let serienumbers: number[] = []
let serie_index = 0
let xOffset = 0
let xPlayer = 0
let team = 0
let hasBall = 0
let yBall = 0
let xBall = 0
let xMax = 0
let waar = 0
waar = 1
xMax = 12
let yMax = 8
xBall = xMax / 2
yBall = yMax / 2
hasBall = 0
let yPlayer = yMax / 2
let yOffset = yPlayer - 2
let brightnessLines = 10
let brightnessPlayer = 255
let brightnessSame = 150
let brightnessOthers = 100
radio.setGroup(222)
basic.showString("Kies A of B")
while (team == 0) {
    basic.pause(100)
}
basic.forever(function () {
    xPlayerPrev = xPlayer
    yPlayerPrev = yPlayer
    basic.pause(500)
    kanteling = input.rotation(Rotation.Pitch)
    if (kanteling < -20 && yPlayer > hasBall) {
        yPlayer += -1
    } else if (kanteling > 20 && yPlayer < yMax - hasBall) {
        yPlayer += 1
    }
    draaien = input.rotation(Rotation.Roll)
    if (draaien < -20 && xPlayer > hasBall) {
        xPlayer += -1
    } else if (draaien > 20 && xPlayer < xMax - hasBall) {
        xPlayer += 1
    }
    for (let index = 0; index <= serienumbers.length; index++) {
        if (xPlayer == xOthers[index] - hasBall && yPlayer == yOthers[index] - hasBall) {
            xPlayer = xPlayerPrev
            yPlayer = yPlayerPrev
        }
    }
    if (hasBall == waar && (xPlayer != xPlayerPrev || yPlayer != yPlayerPrev)) {
        xBall = xPlayer + xPlayer - xPlayerPrev
        yBall = yPlayer + yPlayer - yPlayerPrev
    } else if (xPlayer == xBall && yPlayer == yBall) {
        hasBall = waar
        xBall += xPlayer - xPlayerPrev
        yBall += yPlayer - yPlayerPrev
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
    radio.sendString("" + convertToText(team) + ":" + convertToText(xPlayer) + ":" + convertToText(yPlayer) + ":" + convertToText(hasBall) + ":" + convertToText(xBall) + ":" + convertToText(yBall))
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
    led.plotBrightness(xBall - xOffset, yBall - yOffset, brightnessPlayer)
    for (let index = 0; index <= serienumbers.length - 1; index++) {
        if (team == teamOthers[index]) {
            brightnessTemp = brightnessSame
        } else {
            brightnessTemp = brightnessOthers
        }
        led.plotBrightness(xOthers[index] - xOffset, yOthers[index] - yOffset, brightnessTemp)
    }
    if (team == 1 && (xBall == xMax && yBall == yMax / 2)) {
        scoreA += 1
        scored = 1
    } else if (team == 2 && (xBall == 0 && yBall == yMax / 2)) {
        scoreB += 1
        scored = 1
    }
    if (scored == 1) {
        scored = 0
        basic.showString("Score: " + convertToText(scoreA) + "-" + convertToText(scoreB))
        xBall = xMax / 2
        yBall = yMax / 2
        hasBall = 0
    }
})
