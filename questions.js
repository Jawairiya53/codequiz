// Question bank. Format: [question, [options], correctIndex, explanation]
const TOPICS = {
  html: { name: "HTML", icon: "</>", questions: [
    ["Which tag creates a hyperlink?", ["<link>", "<a>", "<href>", "<url>"], 1, "The <a> (anchor) tag creates links, using the href attribute."],
    ["Which element holds the visible page content?", ["<head>", "<body>", "<meta>", "<title>"], 1, "<body> contains everything the visitor sees."],
    ["Which element is meant for navigation links?", ["<nav>", "<div>", "<span>", "<b>"], 0, "<nav> is a semantic element that helps accessibility and SEO."],
    ["Which attribute gives an element a unique identifier?", ["class", "id", "name", "key"], 1, "An id must be unique in the page. A class can be reused."],
    ["Which tag creates an ordered (numbered) list?", ["<ul>", "<ol>", "<li>", "<dl>"], 1, "<ol> is ordered. <ul> is an unordered (bullet) list."],
    ["Which input type hides what the user types?", ["text", "hidden", "password", "secret"], 2, "type=\"password\" masks the characters."],
    ["Which tag embeds an image?", ["<img>", "<image>", "<src>", "<pic>"], 0, "<img> is a void element that uses src and alt."],
    ["Which line tells the browser the page is HTML5?", ["<html5>", "<!DOCTYPE html>", "<?html?>", "<doctype>"], 1, "<!DOCTYPE html> must be the very first line."]
  ]},
  css: { name: "CSS", icon: "{ }", questions: [
    ["Which property adds space outside an element's border?", ["padding", "margin", "spacing", "gap"], 1, "margin is outside the border. padding is inside."],
    ["Which selector targets class \"box\"?", ["#box", ".box", "box", "*box"], 1, "A dot selects classes. A hash selects ids."],
    ["What does display: flex enable?", ["Flexbox layout", "Floating", "Table layout", "Hiding"], 0, "Flexbox lays children out in a row or column with flexible sizing."],
    ["Which property rounds corners?", ["border-radius", "corner", "round", "border-curve"], 0, "border-radius: 50% makes a circle from a square."],
    ["Which unit is relative to the root font size?", ["px", "em", "rem", "%"], 2, "rem refers to the html element's font size."],
    ["Which rule targets screens up to 600px wide?", ["@media (max-width: 600px)", "@screen small", "@responsive 600", "@small"], 0, "Media queries make a layout responsive."],
    ["What does z-index control?", ["Zoom level", "Stacking order", "Opacity", "Font weight"], 1, "A higher z-index sits on top of a lower one (on positioned elements)."],
    ["Which value removes an element from the page layout?", ["visibility: hidden", "display: none", "opacity: 0", "z-index: -1"], 1, "display: none removes it. visibility: hidden keeps its space."]
  ]},
  js: { name: "JavaScript", icon: "JS", questions: [
    ["Which method turns a JSON string into an object?", ["JSON.parse()", "JSON.stringify()", "JSON.object()", "parseJSON()"], 0, "parse reads a string. stringify does the reverse."],
    ["What is the result of 2 + \"2\"?", ["4", "\"22\"", "NaN", "Error"], 1, "With a string, + concatenates instead of adding."],
    ["Which method finds an element by its id?", ["getElementById()", "getElementsByClass()", "findId()", "selectId()"], 0, "document.getElementById('x') returns one element."],
    ["Which array method returns a new, transformed array?", ["forEach()", "map()", "push()", "splice()"], 1, "map returns a new array. forEach returns nothing."],
    ["What does typeof [] return?", ["\"array\"", "\"object\"", "\"list\"", "\"undefined\""], 1, "Arrays are objects. Use Array.isArray() to check."],
    ["Which keyword declares a block-scoped, reassignable variable?", ["var", "let", "const", "def"], 1, "let is block-scoped. const cannot be reassigned."],
    ["What does addEventListener do?", ["Runs a function when an event happens", "Creates an element", "Loads a file", "Stops a timer"], 0, "It attaches a handler for events such as click."],
    ["Which statement about Promises is true?", ["They represent a future result", "They block the page", "They only work in Node", "They replace variables"], 0, "A Promise stands for a result that will arrive later."]
  ]},
  python: { name: "Python", icon: "Py", questions: [
    ["Which function prints output in Python?", ["print()", "echo()", "console.log()", "write()"], 0, "print() writes to the console."],
    ["Which symbol starts a single-line comment?", ["//", "#", "<!--", "--"], 1, "Python comments begin with #."],
    ["What is len([1, 2, 3])?", ["2", "3", "4", "Error"], 1, "len counts the items in the list."],
    ["Which keyword defines a function?", ["function", "def", "fun", "define"], 1, "def name(): starts a function."],
    ["Which one is a Python list?", ["(1, 2)", "[1, 2]", "{1, 2}", "<1, 2>"], 1, "Square brackets make a list. Parentheses make a tuple."],
    ["What is 7 // 2?", ["3.5", "3", "4", "2"], 1, "// is floor division."],
    ["Which loop runs 5 times starting from 0?", ["for i in range(5):", "for (i=0; i<5; i++)", "loop 5:", "foreach 5:"], 0, "range(5) gives 0 to 4."],
    ["Which type stores key-value pairs?", ["list", "tuple", "dict", "set"], 2, "A dict maps keys to values."]
  ]}
};
