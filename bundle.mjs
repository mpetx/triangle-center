
const segmentLength = (coord) => {
    return Math.sqrt((coord[1][0] - coord[0][0]) ** 2 + (coord[1][1] - coord[0][1]) ** 2);
};

class Triangle {

    vertexAX; vertexAY;
    vertexBX; vertexBY;
    vertexCX; vertexCY;

    constructor(
	vertexAX, vertexAY,
	vertexBX, vertexBY,
	vertexCX, vertexCY) {
	this.vertexAX = vertexAX;
	this.vertexAY = vertexAY;
	this.vertexBX = vertexBX;
	this.vertexBY = vertexBY;
	this.vertexCX = vertexCX;
	this.vertexCY = vertexCY;
    }

    get vertexA() { return [this.vertexAX, this.vertexAY]; }
    get vertexB() { return [this.vertexBX, this.vertexBY]; }
    get vertexC() { return [this.vertexCX, this.vertexCY]; }

    get edgeA() { return [this.vertexB, this.vertexC]; }
    get edgeB() { return [this.vertexC, this.vertexA]; }
    get edgeC() { return [this.vertexA, this.vertexB]; }

    get edgeALength() { return segmentLength(this.edgeA); }
    get edgeBLength() { return segmentLength(this.edgeB); }
    get edgeCLength() { return segmentLength(this.edgeC); }

    get angleA() {
	return Math.acos((this.edgeBLength ** 2 + this.edgeCLength ** 2 - this.edgeALength ** 2) / (2 * this.edgeBLength * this.edgeCLength));
    }

    get angleB() {
	return Math.acos((this.edgeCLength ** 2 + this.edgeALength ** 2 - this.edgeBLength ** 2) / (2 * this.edgeCLength * this.edgeALength));
    }

    get angleC() {
	return Math.acos((this.edgeALength ** 2 + this.edgeBLength ** 2 - this.edgeCLength ** 2) / (2 * this.edgeALength * this.edgeBLength));
    }
    
    
    fromBarycentric(a, b, c) {
	const sum = a + b + c;
	return [
	    (a * this.vertexAX + b * this.vertexBX + c * this.vertexCX) / sum,
	    (a * this.vertexAY + b * this.vertexBY + c * this.vertexCY) / sum
	];
    }

    get centroid() { return this.fromBarycentric(1, 1, 1); }
    get medianA() { return [this.vertexA, this.fromBarycentric(0, 1, 1)]; }
    get medianB() { return [this.vertexB, this.fromBarycentric(1, 0, 1)]; }
    get medianC() { return [this.vertexC, this.fromBarycentric(1, 1, 0)]; }

    get incenter() {
	return this.fromBarycentric(this.edgeALength, this.edgeBLength, this.edgeCLength);
    }
    
    get internalAngleBisectorA() {
	return [this.vertexA, this.fromBarycentric(0, this.edgeBLength, this.edgeCLength)];
    }
    
    get internalAngleBisectorB() {
	return [this.vertexB, this.fromBarycentric(this.edgeALength, 0, this.edgeCLength)];
    }
    
    get internalAngleBisectorC() {
	return [this.vertexC, this.fromBarycentric(this.edgeALength, this.edgeBLength, 0)];
    }
    
    get incircleRadius() {
	const s = (this.edgeALength + this.edgeBLength + this.edgeCLength) / 2;
	return Math.sqrt((s - this.edgeALength) * (s - this.edgeBLength) * (s - this.edgeCLength) / s);
    }

    get incircle() { return [this.incenter, this.incircleRadius]; }

    get incircleRadiusA() {
	return [
	    this.incenter,
	    this.fromBarycentric(0, Math.tan(this.angleB / 2), Math.tan(this.angleC / 2))
	];
    }
    get incircleRadiusB() {
	return [
	    this.incenter,
	    this.fromBarycentric(Math.tan(this.angleA / 2), 0, Math.tan(this.angleC / 2))
	];
    }
    get incircleRadiusC() {
	return [
	    this.incenter,
	    this.fromBarycentric(Math.tan(this.angleA / 2), Math.tan(this.angleB / 2), 0)
	];
    }

    get circumcenter() {
	return this.fromBarycentric(Math.sin(this.angleA * 2), Math.sin(this.angleB * 2), Math.sin(this.angleC * 2));
    }

    get circumcircleRadius() {
	return this.incircleRadius / (Math.cos(this.angleA) + Math.cos(this.angleB) + Math.cos(this.angleC) - 1);
    }

    get circumcircle() { return [this.circumcenter, this.circumcircleRadius]; }

    get edgeBisectorA() { return [this.circumcenter, this.fromBarycentric(0, 1, 1)]; }
    get edgeBisectorB() { return [this.circumcenter, this.fromBarycentric(1, 0, 1)]; }
    get edgeBisectorC() { return [this.circumcenter, this.fromBarycentric(1, 1, 0)]; }

    get circumcircleRadiusA() { return [this.vertexA, this.circumcenter]; }
    get circumcircleRadiusB() { return [this.vertexB, this.circumcenter]; }
    get circumcircleRadiusC() { return [this.vertexC, this.circumcenter]; }

    get orthocenter() {
	return this.fromBarycentric(Math.tan(this.angleA), Math.tan(this.angleB), Math.tan(this.angleC));
    }

    get altitudeA1() {
	return [this.vertexA, this.fromBarycentric(0, Math.tan(this.angleB), Math.tan(this.angleC))];
    }
    get altitudeB1() {
	return [this.vertexB, this.fromBarycentric(Math.tan(this.angleA), 0, Math.tan(this.angleC))];
    }
    get altitudeC1() {
	return [this.vertexC, this.fromBarycentric(Math.tan(this.angleA), Math.tan(this.angleB), 0)];
    }
    get altitudeA2() { return [this.vertexA, this.orthocenter]; }
    get altitudeB2() { return [this.vertexB, this.orthocenter]; }
    get altitudeC2() { return [this.vertexC, this.orthocenter]; }

    get excenterA() {
	return this.fromBarycentric(-this.edgeALength, this.edgeBLength, this.edgeCLength);
    }

    get excenterB() {
	return this.fromBarycentric(this.edgeALength, -this.edgeBLength, this.edgeCLength);
    }

    get excenterC() {
	return this.fromBarycentric(this.edgeALength, this.edgeBLength, -this.edgeCLength);
    }

    get excircleRadiusA() {
	const s = (this.edgeALength + this.edgeBLength + this.edgeCLength) / 2;
	return Math.sqrt(s * (s - this.edgeBLength) * (s - this.edgeCLength) / (s - this.edgeALength));
    }

    get excircleA() { return [this.excenterA, this.excircleRadiusA]; }

    get excircleRadiusB() {
	const s = (this.edgeALength + this.edgeBLength + this.edgeCLength) / 2;
	return Math.sqrt(s * (s - this.edgeCLength) * (s - this.edgeALength) / (s - this.edgeBLength));
    }

    get excircleB() { return [this.excenterB, this.excircleRadiusB]; }
    
    get excircleRadiusC() {
	const s = (this.edgeALength + this.edgeBLength + this.edgeCLength) / 2;
	return Math.sqrt(s * (s - this.edgeALength) * (s - this.edgeBLength) / (s - this.edgeCLength));
    }

    get excircleC() { return [this.excenterC, this.excircleRadiusC]; }
    
    get ninePointCircleCenter() {
	return this.fromBarycentric(
	    this.edgeALength * Math.cos(this.angleB - this.angleC),
	    this.edgeBLength * Math.cos(this.angleC - this.angleA),
	    this.edgeCLength * Math.cos(this.angleA - this.angleB));
    }

    get ninePointCircleRadius() {
	return this.circumcircleRadius / 2;
    }
    
    get ninePointCircle() {
	return [this.ninePointCircleCenter, this.ninePointCircleRadius];
    }

    get lemoine() {
	return this.fromBarycentric(this.edgeALength ** 2, this.edgeBLength ** 2, this.edgeCLength ** 2);
    }

    get symmedianA() {
	return [this.vertexA, this.fromBarycentric(0, this.edgeBLength ** 2, this.edgeCLength ** 2)];
    }

    get symmedianB() {
	return [this.vertexB, this.fromBarycentric(this.edgeALength ** 2, 0, this.edgeCLength ** 2)];
    }

    get symmedianC() {
	return [this.vertexC, this.fromBarycentric(this.edgeALength ** 2, this.edgeBLength ** 2, 0)];
    }

    get gergonne() {
	return this.fromBarycentric(
	    Math.tan(this.angleA / 2),
	    Math.tan(this.angleB / 2),
	    Math.tan(this.angleC / 2));
    }

    get gergonneCevianA() {
	return [
	    this.vertexA,
	    this.fromBarycentric(0, Math.tan(this.angleB / 2), Math.tan(this.angleC / 2))
	];
    }

    get gergonneCevianB() {
	return [
	    this.vertexB,
	    this.fromBarycentric(Math.tan(this.angleA / 2), 0, Math.tan(this.angleC / 2))
	];
    }

    get gergonneCevianC() {
	return [
	    this.vertexC,
	    this.fromBarycentric(Math.tan(this.angleA / 2), Math.tan(this.angleB / 2), 0)
	];
    }

}

const triangle = new Triangle(0, 0, 0, 0, 0, 0);

const initializeTriangle = () => {
    const canvas = document.getElementById("triangle-canvas");
    const rect = canvas.getBoundingClientRect();
    triangle.vertexAX = rect.width * 0.45;
    triangle.vertexAY = rect.height * 0.2;
    triangle.vertexBX = rect.width * 0.3;
    triangle.vertexCX = rect.width * 0.7;
    triangle.vertexBY = triangle.vertexCY = rect.height * 0.8;
    triangleConfigurations.forEach((config) => {
	const colorPicker = document.getElementById(config[0]);
	config[1].forEach((config1) => {
	    const visibilityCheckbox = document.getElementById(config1[0]);
	    config1[2].forEach((id) => {
		const elt = document.getElementById(id);
		elt.setAttribute(config1[1], colorPicker.value);
		elt.setAttribute("visibility", visibilityCheckbox.checked ? "visible" : "hidden");
	    });
	});
    });
    updateTriangle();
};

const setPointPosition = (id, coords) => {
    const elt = document.getElementById(id);
    elt.setAttribute("cx", coords[0]);
    elt.setAttribute("cy", coords[1]);
};

const setSegmentPosition = (id, coords) => {
    const elt = document.getElementById(id);
    elt.setAttribute("x1", coords[0][0]);
    elt.setAttribute("y1", coords[0][1]);
    elt.setAttribute("x2", coords[1][0]);
    elt.setAttribute("y2", coords[1][1]);
};

const setCirclePosition = (id, coords) => {
    const elt = document.getElementById(id);
    elt.setAttribute("cx", coords[0][0]);
    elt.setAttribute("cy", coords[0][1]);
    elt.setAttribute("r", coords[1]);
};

const updateTriangle = () => {
    setPointPosition("triangle__vertex-a", triangle.vertexA);
    setPointPosition("triangle__vertex-b", triangle.vertexB);
    setPointPosition("triangle__vertex-c", triangle.vertexC);
    setSegmentPosition("triangle__edge-a", triangle.edgeA);
    setSegmentPosition("triangle__edge-b", triangle.edgeB);
    setSegmentPosition("triangle__edge-c", triangle.edgeC);
    if (document.getElementById("incenter-config__incenter").checked)
	setPointPosition("triangle__incenter", triangle.incenter);
    if (document.getElementById("incenter-config__internal-angle-bisector").checked) {
	setSegmentPosition("triangle__internal-angle-bisector-a", triangle.internalAngleBisectorA);
	setSegmentPosition("triangle__internal-angle-bisector-b", triangle.internalAngleBisectorB);
	setSegmentPosition("triangle__internal-angle-bisector-c", triangle.internalAngleBisectorC);
    }
    if (document.getElementById("incenter-config__incircle-radius")) {
	setSegmentPosition("triangle__incircle-radius-a", triangle.incircleRadiusA);
	setSegmentPosition("triangle__incircle-radius-b", triangle.incircleRadiusB);
	setSegmentPosition("triangle__incircle-radius-c", triangle.incircleRadiusC);
    }
    if (document.getElementById("incenter-config__incircle").checked)
	setCirclePosition("triangle__incircle", triangle.incircle);
    if (document.getElementById("centroid-config__centroid").checked)
	setPointPosition("triangle__centroid", triangle.centroid);
    if (document.getElementById("centroid-config__median").checked) {
	setSegmentPosition("triangle__median-a", triangle.medianA);
	setSegmentPosition("triangle__median-b", triangle.medianB);
	setSegmentPosition("triangle__median-c", triangle.medianC);
    }
    if (document.getElementById("circumcenter-config__circumcenter").checked)
	setPointPosition("triangle__circumcenter", triangle.circumcenter);
    if (document.getElementById("circumcenter-config__circumcircle").checked)
	setCirclePosition("triangle__circumcircle", triangle.circumcircle);
    if (document.getElementById("circumcenter-config__edge-bisector").checked) {
	setSegmentPosition("triangle__edge-bisector-a", triangle.edgeBisectorA);
	setSegmentPosition("triangle__edge-bisector-b", triangle.edgeBisectorB);
	setSegmentPosition("triangle__edge-bisector-c", triangle.edgeBisectorC);
    }
    if (document.getElementById("circumcenter-config__circumcircle-radius").checked) {
	setSegmentPosition("triangle__circumcircle-radius-a", triangle.circumcircleRadiusA);
	setSegmentPosition("triangle__circumcircle-radius-b", triangle.circumcircleRadiusB);
	setSegmentPosition("triangle__circumcircle-radius-c", triangle.circumcircleRadiusC);
    }
    if (document.getElementById("orthocenter-config__orthocenter").checked)
	setPointPosition("triangle__orthocenter", triangle.orthocenter);
    if (document.getElementById("orthocenter-config__altitude").checked) {
	setSegmentPosition("triangle__altitude-a-1", triangle.altitudeA1);
	setSegmentPosition("triangle__altitude-b-1", triangle.altitudeB1);
	setSegmentPosition("triangle__altitude-c-1", triangle.altitudeC1);
	setSegmentPosition("triangle__altitude-a-2", triangle.altitudeA2);
	setSegmentPosition("triangle__altitude-b-2", triangle.altitudeB2);
	setSegmentPosition("triangle__altitude-c-2", triangle.altitudeC2);
    }
    if (document.getElementById("excenter-config__excenter").checked) {
	setPointPosition("triangle__excenter-a", triangle.excenterA);
	setPointPosition("triangle__excenter-b", triangle.excenterB);
	setPointPosition("triangle__excenter-c", triangle.excenterC);
    }
    if (document.getElementById("excenter-config__excircle").checked) {
	setCirclePosition("triangle__excircle-a", triangle.excircleA);
	setCirclePosition("triangle__excircle-b", triangle.excircleB);
	setCirclePosition("triangle__excircle-c", triangle.excircleC);
    }
    if (document.getElementById("nine-point-circle-config__center").checked)
	setPointPosition("triangle__nine-point-circle-center", triangle.ninePointCircleCenter);
    if (document.getElementById("nine-point-circle-config__circle").checked)
	setCirclePosition("triangle__nine-point-circle", triangle.ninePointCircle);
    if (document.getElementById("lemoine-config__lemoine").checked)
	setPointPosition("triangle__lemoine", triangle.lemoine);
    if (document.getElementById("lemoine-config__symmedian").checked) {
	setSegmentPosition("triangle__symmedian-a", triangle.symmedianA);
	setSegmentPosition("triangle__symmedian-b", triangle.symmedianB);
	setSegmentPosition("triangle__symmedian-c", triangle.symmedianC);
    }
    if (document.getElementById("gergonne-config__gergonne").checked)
	setPointPosition("triangle__gergonne", triangle.gergonne);
    if (document.getElementById("gergonne-config__cevian").checked) {
	setSegmentPosition("triangle__gergonne-cevian-a", triangle.gergonneCevianA);
	setSegmentPosition("triangle__gergonne-cevian-b", triangle.gergonneCevianB);
	setSegmentPosition("triangle__gergonne-cevian-c", triangle.gergonneCevianC);
    }
};

const triangleVertexMouseEnterListener = (e) => {
    e.target.setAttribute("r", 6);
    e.target.setAttribute("fill", "red");
};

const triangleVertexMouseLeaveListener = (e) => {
    e.target.setAttribute("r", 4);
    e.target.setAttribute("fill", "black");
};

const canvasMouseMoveListeners = (() => {
    const createListener = (setter) => (e) => {
	setter(e.offsetX, e.offsetY);
	updateTriangle();
    };
    return {
	"triangle__vertex-a": createListener((x, y) => { triangle.vertexAX = x; triangle.vertexAY = y; }),
	"triangle__vertex-b": createListener((x, y) => { triangle.vertexBX = x; triangle.vertexBY = y; }),
	"triangle__vertex-c": createListener((x, y) => { triangle.vertexCX = x; triangle.vertexCY = y; })
    };
})();

const triangleVertexMouseDownListener = (e) => {
    document.getElementById("triangle-canvas").addEventListener("mousemove", canvasMouseMoveListeners[e.target.id]);
};

const triangleVertexMouseUpListener = (e) => {
    document.getElementById("triangle-canvas").removeEventListener("mousemove", canvasMouseMoveListeners[e.target.id]);
};

const createColorPickerInputListener = (config) => (e) => {
    config.forEach((config1) => {
	config1[2].forEach((id) => {
	    document.getElementById(id).setAttribute(config1[1], e.target.value);
	});
    });
};

const createVisibilityCheckboxInputListener = (ids) => (e) => {
    ids.forEach((id) => {
	document.getElementById(id).setAttribute("visibility", e.target.checked ? "visible" : "hidden");
    });
    if (e.target.checked)
	updateTriangle();
};

const triangleVertexIds = ["triangle__vertex-a", "triangle__vertex-b", "triangle__vertex-c"];
const triangleConfigurations = [
    [
	"centroid-config__color",
	[
	    ["centroid-config__centroid", "fill", ["triangle__centroid"]],
	    ["centroid-config__median", "stroke", ["triangle__median-a", "triangle__median-b", "triangle__median-c"]]
	]
    ], [
	"incenter-config__color",
	[
	    ["incenter-config__incenter", "fill", ["triangle__incenter"]],
	    ["incenter-config__internal-angle-bisector", "stroke", ["triangle__internal-angle-bisector-a", "triangle__internal-angle-bisector-b", "triangle__internal-angle-bisector-c"]],
	    ["incenter-config__incircle", "stroke", ["triangle__incircle"]],
	    ["incenter-config__incircle-radius", "stroke", ["triangle__incircle-radius-a", "triangle__incircle-radius-b", "triangle__incircle-radius-c"]]
	]
    ], [
	"circumcenter-config__color",
	[
	    ["circumcenter-config__circumcenter", "fill", ["triangle__circumcenter"]],
	    ["circumcenter-config__circumcircle", "stroke", ["triangle__circumcircle"]],
	    ["circumcenter-config__edge-bisector", "stroke", ["triangle__edge-bisector-a", "triangle__edge-bisector-b", "triangle__edge-bisector-c"]],
	    ["circumcenter-config__circumcircle-radius", "stroke", ["triangle__circumcircle-radius-a", "triangle__circumcircle-radius-b", "triangle__circumcircle-radius-c"]]
	]
    ], [
	"orthocenter-config__color",
	[
	    ["orthocenter-config__orthocenter", "fill", ["triangle__orthocenter"]],
	    ["orthocenter-config__altitude", "stroke", ["triangle__altitude-a-1", "triangle__altitude-b-1", "triangle__altitude-c-1", "triangle__altitude-a-2", "triangle__altitude-b-2", "triangle__altitude-c-2"]]
	]
    ], [
	"excenter-config__color",
	[
	    ["excenter-config__excenter", "fill", ["triangle__excenter-a", "triangle__excenter-b", "triangle__excenter-c"]],
	    ["excenter-config__excircle", "stroke", ["triangle__excircle-a", "triangle__excircle-b", "triangle__excircle-c"]]
	]
    ],[
	"nine-point-circle-config__color",
	[
	    ["nine-point-circle-config__center", "fill", ["triangle__nine-point-circle-center"]],
	    ["nine-point-circle-config__circle", "stroke", ["triangle__nine-point-circle"]]
	]
    ], [
	"lemoine-config__color",
	[
	    ["lemoine-config__lemoine", "fill", ["triangle__lemoine"]],
	    ["lemoine-config__symmedian", "stroke", ["triangle__symmedian-a", "triangle__symmedian-b", "triangle__symmedian-c"]]
	]
    ], [
	"gergonne-config__color",
	[
	    ["gergonne-config__gergonne", "fill", ["triangle__gergonne"]],
	    ["gergonne-config__cevian", "stroke", ["triangle__gergonne-cevian-a", "triangle__gergonne-cevian-b", "triangle__gergonne-cevian-c"]]
	]
    ]
];

window.addEventListener("load", () => {
    initializeTriangle();
    triangleVertexIds.forEach((id) => {
	const elt = document.getElementById(id);
	elt.addEventListener("mouseenter", triangleVertexMouseEnterListener);
	elt.addEventListener("mouseleave", triangleVertexMouseLeaveListener);
	elt.addEventListener("mousedown", triangleVertexMouseDownListener);
	elt.addEventListener("mouseup", triangleVertexMouseUpListener);
    });
    triangleConfigurations.forEach((config) => {
	const colorPicker = document.getElementById(config[0]);
	colorPicker.addEventListener("input", createColorPickerInputListener(config[1]));
	config[1].forEach((config1) => {
	    document.getElementById(config1[0]).addEventListener("input", createVisibilityCheckboxInputListener(config1[2]));
	});
    });
});
