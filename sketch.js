/*
@author Kiwi
@date 2021-09-15

 */


let font
let vehicles = []
let points = []

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(600, 600)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)
}

function draw() {
    background(0, 0, 30)

    stroke(0, 0, 100)
    strokeWeight(24)
    point(0, 300)
    point(mouseX, mouseY) // control
    point(400, 400) // control
    point(600, 300)

    strokeWeight(4)
    fill(0, 0, 80, 20)
    beginShape()
    vertex(0, 300)
    bezierVertex(mouseX, mouseY, 400, 400, 600, 300)
    bezierVertex(400, 600, 200, 100, 0, 300)
    endShape(CLOSE)

    strokeWeight(2)
    line(0, 300, mouseX, mouseY)
    line(400, 400, 600, 300)

}

