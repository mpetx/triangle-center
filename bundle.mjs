
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
