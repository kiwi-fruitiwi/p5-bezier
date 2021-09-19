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
    white circles are major vertices
        fill is the background color
        stroke is white
        lines are white
    2nd order vertices are blue
    3rd order red
    actual bezier curve is red
    mouseX « sets t value
    quadratic example
        p0, p2 are equilateral triangle bottoms
        p1 is width/2, height/4
 */


let font
let vehicles = []
let points = []

// a,c are the endpoints
// d is the result of lerp between a, b
// e is the result of lerp between b, c
// f is the lerp between d and e
let a, b, c, d, e, f

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)

    a = new p5.Vector(width/4, height/2)
    b = new p5.Vector(width/2, height/4)
    c = new p5.Vector(width*3/4, height/2)

    // I didn't know we could initialize the value!!
    mouseX = width/2
}

function draw() {
    b.x = mouseX
    b.y = mouseY
    quadratic_example()
    cubic_example()
}


// encapsulates the visualization of a cubic bezier curve
function cubic_example() {

}


// encapsulates the visualization of our quadratic bezier curve
function quadratic_example() {
    let bg = color(0, 0, 25)
    background(bg)

    /* TODO z-index order notes
        the blue circles should be under the white ones
        the blue lines should disappear as t approaches 0 and 1
            this will happen if they are under!
     */

    // for some reason, we have to constrain the mouse
    // otherwise p5.js allows us to move our mouse off the canvas
    // mouseX = constrain(mouseX, a.x, c.x)
    mouseX = constrain(mouseX, 0, width)

    // main time control for our bezier curve
    // let t = map(mouseX, a.x, c.x, 0, 1)
    // let t = map(mouseX, 0, width, 0, 1)

    t = abs(sin(frameCount * 0.01))
    d = p5.Vector.lerp(a, b, t)
    e = p5.Vector.lerp(b, c, t)
    f = p5.Vector.lerp(d, e, t)

    noFill()

    // we want the blue 2nd order lerp lines to be under the
    // 1st order gray
    stroke(200, 100, 80) // blue
    line(d.x, d.y, e.x, e.y)

    // draw lines first so they are underneathe the vertices
    stroke(0, 0, 60) // gray
    line(a.x, a.y, b.x, b.y)
    line(b.x, b.y, c.x, c.y)


    strokeWeight(2)
    // a blue circle for each vertex d, e
    // a line between them
    fill(bg)

    // if t is close to 0 or 1, reduce the line's alpha to 0
    // let blue_line_alpha = map(abs(t-0.5), 0, 0.5, 100, 0)

    stroke(200, 100, 80)
    circle(d.x, d.y, 10)
    circle(e.x, e.y, 10)

    // draw a path for our curve
    strokeWeight(3)
    stroke(0, 0, 100) // white
    // s is the t value inside this loop, going from 0 up to t itself
    for (let s=0; s<=t; s+=0.001) {
        let v = quadratic(a, b, c, s)
        point(v.x, v.y)
    }

    // f is our main drawing point for the quadratic bezier curve
    stroke(0, 0, 100) // white
    circle(f.x, f.y, 12)

    // a circle for each vertex a, b, c
    fill(bg)
    strokeWeight(2)
    circle(a.x, a.y, 10)
    circle(b.x, b.y, 10)
    circle(c.x, c.y, 10)
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

    // line(x1, y1, x2, y2)
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