/*
@author Kiwi
@date 2021-09-15

We are exploring Bezier curves with Daniel!
https://www.youtube.com/watch?v=enNfb6p3j_g

We learned about lerp too!

lerp(x₀, x₁, t)

winry: x₀ + x₁*t
cody: x₀*t+x₁(1-t) » x₁*t+x₀(1-t)
kiwi: (x₁-x₀)*t + x₀

 */


let font
let vehicles = []
let points = []

// lerp practice!
let p0, p1, p2

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(600, 600)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)

    p0 = new p5.Vector(0, 300)
    p1 = new p5.Vector(300, 0)
    p2 = new p5.Vector(600, 300)
}

function draw() {
    background(0, 0, 30)
    p1 = new p5.Vector(mouseX, mouseY)

    stroke(0, 0, 80)
    noFill()
    // beginShape()
    for (let t=0; t<=1.01; t+=0.005) {
        let x1 = lerp(p0.x, p1.x, t)
        let y1 = lerp(p0.y, p1.y, t)
        let x2 = lerp(p1.x, p2.x, t)
        let y2 = lerp(p1.y, p2.y, t)

        stroke(t*360, 100, 100)
        line(x1, y1, x2, y2)
        let x = lerp(x1, x2, t)
        let y = lerp(y1, y2, t)
        // point(x, y)
    }

    // endShape()


    // stroke(0, 0, 100)
    // strokeWeight(24)
    // point(0, 300)
    // point(mouseX, mouseY) // control
    // point(400, 400) // control
    // point(600, 300)
    //
    // strokeWeight(4)
    // fill(0, 0, 80, 20)
    // beginShape()
    // vertex(0, 300)
    // bezierVertex(mouseX, mouseY, 400, 400, 600, 300)
    // bezierVertex(400, 600, 200, 100, 0, 300)
    // endShape(CLOSE)
    //
    // strokeWeight(2)
    // line(0, 300, mouseX, mouseY)
    // line(400, 400, 600, 300)

}

