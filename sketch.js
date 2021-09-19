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

goal: clone Freya's lerp animation https://youtu.be/aVwxzDHniEw?t=21


 */


let font
let vehicles = []
let points = []

// lerp practice!
let p0, p1, p2, p3

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(600, 600)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)

    p0 = new p5.Vector(0, 300)
    p1 = new p5.Vector(300, 0)
    p2 = new p5.Vector(400, 0)
    p3 = new p5.Vector(600, 300)
}

// receives 3 points, and returns a point on the quadratic
// bezier curve
function quadratic(p0, p1, p2, t) {
    let x1 = lerp(p0.x, p1.x, t)
    let y1 = lerp(p0.y, p1.y, t)
    let x2 = lerp(p1.x, p2.x, t)
    let y2 = lerp(p1.y, p2.y, t)
    let x = lerp(x1, x2, t)
    let y = lerp(y1, y2, t)

    line(x1, y1, x2, y2)
    return new p5.Vector(x, y)
}

// two endpoints + two control points » cubic bezier vertex
function cubic(p0, p1, p2, p3, t) {
    let v1 = quadratic(p0, p1, p2, t)
    let v2 = quadratic(p1, p2, p3, t)
    let x = lerp(v1.x, v2.x, t)
    let y = lerp(v1.y, v2.y, t)

    line(v1.x, v1.y, v2.x, v2.y)
    return new p5.Vector(x, y)
}

function draw() {
    background(0, 0, 30)
    p1 = new p5.Vector(mouseX, mouseY)

    noFill()

    /* the 1.00001 is a rounding error hack */
    for (let t=0; t<=1.0001; t+=0.05) {
        stroke(t*360, 100, 90, 70)
        let v = cubic(p0, p1, p2, p3, t)
        vertex(v.x, v.y)
    }
}

