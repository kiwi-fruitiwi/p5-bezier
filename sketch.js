/*
@author Kiwi
@date 2021-09-15

We are exploring Bezier curves with Daniel!
https://www.youtube.com/watch?v=enNfb6p3j_g

We learned about lerp too!
lerp(x₀, x₁, t)
    winry: x₀ + x₁*t, oops
    cody: x₀*t+x₁(1-t) » x₁*t+x₀(1-t), weighted average form
    kiwi: (x₁-x₀)*t + x₀, initial + difference form

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

add draggable vertices
TODO: add "try dragging the white vertices" message
TODO: add hover to DraggableVertices
TODO: overlapping DraggableVertices should only drag top-most vertex

done
    added quadratic setup
    refactored variable names from a,b,c,d,e to A,B,C,D,E -> ab, bc, cd -> ab_bc


version comments draft
    bezier function to make mouse-controllable control point, cubic
    implementing lerp from scratch: one dimension (number line)
    quadratic lerp method: 3 lerp calls between 3 points
    cubic lerp method
        begin +end shape
    bezier lerp mesh with t
    refactor code for p5.Vector.lerp
    make each vertex a particle with velocity, edges
    advanced project:
        drag and drop demo
        add hover effect
        transfer drag and drop code into p5-bezier

 */

// if I knew more javascript, this should probably inherit from p5.Vector?
// as is, I suppose we should return a vector and make sure there's no
// mutability problems
class DraggableVertex {
    // contains a p5.Vector as its internal representation
    constructor(x, y) {
        this.v = new p5.Vector(x, y)
        this.r = 5

        this.offsetX = 0
        this.offsetY = 0
        this.dragging = false
    }

    // x, y parameters are the coordinates of the mouse while dragging
    show(x, y) {
        // where do I show this if it's being dragged?
        if (this.dragging) {
            this.v.x = x - this.offsetX
            this.v.y = y - this.offsetY
        }

        stroke(0, 0, 100) // white
        strokeWeight(2)

        circle(this.v.x, this.v.y, this.r*2)
    }

    pressed(x, y) {
        // this is a contains check. Is the mouse at (mx, my) within the
        // boundary of our rectangle?
        if (this.contains(x, y)) {
            this.dragging = true
            this.offsetX = x - this.v.x
            this.offsetY = y - this.v.y
        }
    }

    notPressed(x, y) {
        this.dragging = false
    }

    // returns true if the point's distance from our center is < our radius
    contains(x, y) {
        return (dist(this.v.x, this.v.y, x, y) <= this.r)
    }
}


let font
let vehicles = []
let points = []

// a,c are the endpoints
// d is the result of lerp between a, b
// e is the result of lerp between b, c
// f is the lerp between d and e
let a, b, c, d // these are DraggableVertex objects that contain p5.Vector
let ab, bc, cd // lerp points (p5.Vector) between main vertices
let ab_bc, bc_cd // ab_bc is the lerp vertex between line segments ab and bc
let draw_vertex // this is the vertex where the Bezier Curve is drawn from

// list of DraggableVertices
let draggableVertices

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)

    // I didn't know we could initialize the value!!
    // mouseX = width/2
    quadratic_setup()

}

function draw() {
    quadratic_example()
}


// encapsulates the visualization of a cubic bezier curve
function cubic_example() {

}

// test
function test() {
    console.log("test")
}

function mousePressed() {
    draggableVertices.forEach(dv => dv.pressed(mouseX, mouseY))
}

function mouseReleased() {
    draggableVertices.forEach(dv => dv.notPressed())
}


function quadratic_setup() {
    a = new DraggableVertex(width/4, height/2)
    b = new DraggableVertex(width/2, height/4)
    c = new DraggableVertex(width*3/4, height/2)
    draggableVertices = [a, b, c]
}

// encapsulates the visualization of our quadratic bezier curve
function quadratic_example() {
    let bg = color(0, 0, 25)
    background(bg)
    noFill()

    /* TODO z-index order notes
        the blue circles should be under the white ones
        the blue lines should disappear as t approaches 0 and 1
            this will happen if they are under!
     */

    // for some reason, we have to constrain the mouse
    // otherwise p5.js allows us to move our mouse off the canvas
    // mouseX = constrain(mouseX, a.x, c.x)
    mouseX = constrain(mouseX, 0, width)
    mouseY = constrain(mouseY, 0, height)

    // main time control for our bezier curve
    // let t = map(mouseX, a.x, c.x, 0, 1)
    // let t = map(mouseX, 0, width, 0, 1)
    let t = abs(sin(frameCount * 0.01))
    let a, b, c // temporary p5.Vector variables to hold DraggableVertex
    a = a.v
    b = b.v
    c = c.v
    ab = p5.Vector.lerp(a, b, t)
    bc = p5.Vector.lerp(b, c, t)
    draw_vertex = p5.Vector.lerp(ab, bc, t)

    // draw lines first so they are underneathe the vertices
    // we want the blue 2nd order blue lerp line to be under the
    // 1st order gray lines
    stroke(200, 100, 80) // blue
    line(ab.x, ab.y, bc.x, bc.y) // a line between d and e

    stroke(0, 0, 60) // gray
    line(a.x, a.y, b.x, b.y)
    line(b.x, b.y, c.x, c.y)

    strokeWeight(2) // vertex strokeWeight
    // a blue circle for each vertex d, e
    fill(bg)

    // finally, draw all the vertex circles
    // blue vertices for d, e
    stroke(200, 100, 80)
    circle(ab.x, ab.y, 10)
    circle(bc.x, bc.y, 10)

    // draw a path for our curve. this should be 2nd highest in z-order
    // this has to come after vertices d and e to stay above them :P
    strokeWeight(3)
    stroke(0, 0, 100) // white
    // s is the time value inside this loop,
    // going from 0 up to t itself
    for (let s=0; s<=t; s+=0.001) {
        // f is our main drawing point for the quadratic bezier curve
        // here, the v returned is equal to f
        let v = quadratic(a, b, c, s)
        point(v.x, v.y)
    }

    // these are the highest z-index values
    stroke(0, 0, 100) // white
    circle(draw_vertex.x, draw_vertex.y, 12)

    fill(bg)
    a.show(mouseX, mouseY)
    b.show(mouseX, mouseY)
    c.show(mouseX, mouseY)
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