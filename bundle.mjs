
const segmentLength = (coord) => {
    return Math.sqrt((coord[1][0] - coord[0][0]) ** 2 + (coord[1][1] - coord[0][1]) ** 2);
};

const minPoint = (...ps) => {
    let minxp = ps[0];
    let minyp = ps[0];
    let maxx = ps[0][0];
    let maxy = ps[0][1];
    for (let i = 1; i < ps.length; ++i) {
	let p = ps[i];
	if (p[0] < minxp[0])
	    minxp = p;
	if (p[1] < minyp[1])
	    minyp = p;
	if (p[0] > maxx)
	    maxx = p[0];
	if (p[1] > maxy)
	    maxy = p[1];
    }
    if ((maxx - minxp[0]) > (maxy - minyp[1]))
	return minxp;
    else
	return minyp;
};

const maxPoint = (...ps) => {
    let maxxp = ps[0];
    let maxyp = ps[0];
    let minx = ps[0][0];
    let miny = ps[0][1];
    for (let i = 1; i < ps.length; ++i) {
	let p = ps[i];
	if (p[0] > maxxp[0])
	    maxxp = p;
	if (p[1] > maxyp[1])
	    maxyp = p;
	if (p[0] < minx)
	    minx = p[0];
	if (p[1] < miny)
	    miny = p[1];
    }
    if ((maxxp[0] - minx) > (maxyp[1] - miny))
	return maxxp
    else
	return maxyp;
};

const centroidTriangleCenterFunction = (a, b, c, anga, angb, angc) => 1;
const incenterTriangleCenterFunction = (a, b, c, anga, angb, angc) => a;
const circumcenterTriangleCenterFunction = (a, b, c, anga, angb, angc) => Math.sin(anga * 2);
const orthocenterTriangleCenterFunction = (a, b, c, anga, angb, angc) => Math.tan(anga);
const ninePointTriangleCenterFunction = (a, b, c, anga, angb, angc) => a * Math.cos(angb - angc);
const lemoineTriangleCenterFunction = (a, b, c, anga, angb, angc) => a ** 2;
const gergonneTriangleCenterFunction = (a, b, c, anga, angb, angc) => Math.tan(anga / 2);
const nagelTriangleCenterFunction = (a, b, c, anga, angb, angc) => 1 / Math.tan(anga / 2);

class Triangle {

    #cache;
    #vertexAX; #vertexAY;
    #vertexBX; #vertexBY;
    #vertexCX; #vertexCY;

    constructor(
	vertexAX, vertexAY,
	vertexBX, vertexBY,
	vertexCX, vertexCY) {
	this.#cache = [null, null, null, null, null, null];
	this.#vertexAX = vertexAX;
	this.#vertexAY = vertexAY;
	this.#vertexBX = vertexBX;
	this.#vertexBY = vertexBY;
	this.#vertexCX = vertexCX;
	this.#vertexCY = vertexCY;
    }

    invalidateCache() {
	for (let i = 0; i < this.#cache.length; ++i)
	    this.#cache[i] = null;
    }

    get vertexAX() { return this.#vertexAX; }
    get vertexAY() { return this.#vertexAY; }
    get vertexBX() { return this.#vertexBX; }
    get vertexBY() { return this.#vertexBY; }
    get vertexCX() { return this.#vertexCX; }
    get vertexCY() { return this.#vertexCY; }

    set vertexAX(v) { this.invalidateCache(); this.#vertexAX = v; }
    set vertexAY(v) { this.invalidateCache(); this.#vertexAY = v; }
    set vertexBX(v) { this.invalidateCache(); this.#vertexBX = v; }
    set vertexBY(v) { this.invalidateCache(); this.#vertexBY = v; }
    set vertexCX(v) { this.invalidateCache(); this.#vertexCX = v; }
    set vertexCY(v) { this.invalidateCache(); this.#vertexCY = v; }
    
    get vertexA() { return [this.vertexAX, this.vertexAY]; }
    get vertexB() { return [this.vertexBX, this.vertexBY]; }
    get vertexC() { return [this.vertexCX, this.vertexCY]; }

    get edgeA() { return [this.vertexB, this.vertexC]; }
    get edgeB() { return [this.vertexC, this.vertexA]; }
    get edgeC() { return [this.vertexA, this.vertexB]; }

    get edgeALength() {
	const cacheValue = this.#cache[0];
	if (cacheValue !== null)
	    return cacheValue;
	const value = segmentLength(this.edgeA);
	this.#cache[0] = value;
	return value;
    }

    get edgeBLength() {
	const cacheValue = this.#cache[1];
	if (cacheValue !== null)
	    return cacheValue;
	const value = segmentLength(this.edgeB);
	this.#cache[1] = value;
	return value;
    }

    get edgeCLength() {
	const cacheValue = this.#cache[2];
	if (cacheValue !== null)
	    return cacheValue;
	const value = segmentLength(this.edgeC);
	this.#cache[2] = value;
	return value;
    }

    get angleA() {
	const cacheValue = this.#cache[3];
	if (cacheValue !== null)
	    return cacheValue;
	const value = Math.acos((this.edgeBLength ** 2 + this.edgeCLength ** 2 - this.edgeALength ** 2) / (2 * this.edgeBLength * this.edgeCLength));
	this.#cache[3] = value;
	return value;
    }

    get angleB() {
	const cacheValue = this.#cache[4];
	if (cacheValue !== null)
	    return cacheValue;
	const value = Math.acos((this.edgeCLength ** 2 + this.edgeALength ** 2 - this.edgeBLength ** 2) / (2 * this.edgeCLength * this.edgeALength));
	this.#cache[4] = value;
	return value;
    }

    get angleC() {
	const cacheValue = this.#cache[5];
	if (cacheValue !== null)
	    return cacheValue;
	const value = Math.acos((this.edgeALength ** 2 + this.edgeBLength ** 2 - this.edgeCLength ** 2) / (2 * this.edgeALength * this.edgeBLength));
	this.#cache[5] = value;
	return value;
    }
    
    fromBarycentric(a, b, c) {
	const sum = a + b + c;
	return [
	    (a * this.vertexAX + b * this.vertexBX + c * this.vertexCX) / sum,
	    (a * this.vertexAY + b * this.vertexBY + c * this.vertexCY) / sum
	];
    }

    fromTriangleCenterFunction(f) {
	return this.fromBarycentric(
	    f(this.edgeALength, this.edgeBLength, this.edgeCLength, this.angleA, this.angleB, this.angleC),
	    f(this.edgeBLength, this.edgeCLength, this.edgeALength, this.angleB, this.angleC, this.angleA),
	    f(this.edgeCLength, this.edgeALength, this.edgeBLength, this.angleC, this.angleA, this.angleB));
    }

    cevianAFromTriangleCenterFunction(f) {
	return [
	    this.vertexA,
	    this.fromBarycentric(
		0,
		f(this.edgeBLength, this.edgeCLength, this.edgeALength, this.angleB, this.angleC, this.angleA),
		f(this.edgeCLength, this.edgeALength, this.edgeBLength, this.angleC, this.angleA, this.angleB))];
    }

    cevianBFromTriangleCenterFunction(f) {
	return [
	    this.vertexB,
	    this.fromBarycentric(
		f(this.edgeALength, this.edgeBLength, this.edgeCLength, this.angleA, this.angleB, this.angleC),
		0,
		f(this.edgeCLength, this.edgeALength, this.edgeBLength, this.angleC, this.angleA, this.angleB))];
    }

    cevianCFromTriangleCenterFunction(f) {
	return [
	    this.vertexC,
	    this.fromBarycentric(
		f(this.edgeALength, this.edgeBLength, this.edgeCLength, this.angleA, this.angleB, this.angleC),
		f(this.edgeBLength, this.edgeCLength, this.edgeALength, this.angleB, this.angleC, this.angleA),
		0)];
    }
    
    get centroid() { return this.fromTriangleCenterFunction(centroidTriangleCenterFunction); }
    get medianA() { return this.cevianAFromTriangleCenterFunction(centroidTriangleCenterFunction); }
    get medianB() { return this.cevianBFromTriangleCenterFunction(centroidTriangleCenterFunction); }
    get medianC() { return this.cevianCFromTriangleCenterFunction(centroidTriangleCenterFunction); }

    get incenter() { return this.fromTriangleCenterFunction(incenterTriangleCenterFunction); }
    get internalAngleBisectorA() { return this.cevianAFromTriangleCenterFunction(incenterTriangleCenterFunction); }
    get internalAngleBisectorB() { return this.cevianBFromTriangleCenterFunction(incenterTriangleCenterFunction); }
    get internalAngleBisectorC() { return this.cevianCFromTriangleCenterFunction(incenterTriangleCenterFunction); }
    
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

    get circumcenter() { return this.fromTriangleCenterFunction(circumcenterTriangleCenterFunction); }


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

    get orthocenter() { return this.fromTriangleCenterFunction(orthocenterTriangleCenterFunction); }

    get altitudeA() {
	const [p1, p2] = this.cevianAFromTriangleCenterFunction(orthocenterTriangleCenterFunction);
	const p3 = this.orthocenter;
	return [minPoint(p1, p2, p3), maxPoint(p1, p2, p3)];
    }

    get altitudeB() {
	const [p1, p2] = this.cevianBFromTriangleCenterFunction(orthocenterTriangleCenterFunction);
	const p3 = this.orthocenter;
	return [minPoint(p1, p2, p3), maxPoint(p1, p2, p3)];
    }

    get altitudeC() {
	const [p1, p2] = this.cevianCFromTriangleCenterFunction(orthocenterTriangleCenterFunction);
	const p3 = this.orthocenter;
	return [minPoint(p1, p2, p3), maxPoint(p1, p2, p3)];
    }

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

    get excircleRadiusAA() { return [this.excenterA, this.fromBarycentric(0, 1 / Math.tan(this.angleB / 2), 1 / Math.tan(this.angleC / 2))]; }
    get excircleRadiusAB() { return [this.excenterA, this.fromBarycentric(-Math.tan(this.angleA / 2), 0, 1 / Math.tan(this.angleC / 2))]; }
    get excircleRadiusAC() { return [this.excenterA, this.fromBarycentric(-Math.tan(this.angleA / 2), 1 / Math.tan(this.angleB / 2), 0)]; }
    get excircleRadiusBA() { return [this.excenterB, this.fromBarycentric(0, -Math.tan(this.angleB / 2), 1 / Math.tan(this.angleC / 2))]; }
    get excircleRadiusBB() { return [this.excenterB, this.fromBarycentric(1 / Math.tan(this.angleA / 2), 0, 1 / Math.tan(this.angleC / 2))]; }
    get excircleRadiusBC() { return [this.excenterB, this.fromBarycentric(1 / Math.tan(this.angleA / 2), -Math.tan(this.angleB / 2), 0)]; }
    get excircleRadiusCA() { return [this.excenterC, this.fromBarycentric(0, 1 / Math.tan(this.angleB / 2), -Math.tan(this.angleC / 2))]; }
    get excircleRadiusCB() { return [this.excenterC, this.fromBarycentric(1 / Math.tan(this.angleA / 2), 0, -Math.tan(this.angleC / 2))]; }
    get excircleRadiusCC() { return [this.excenterC, this.fromBarycentric(1 / Math.tan(this.angleA / 2), 1 / Math.tan(this.angleB / 2), 0)]; }
    
    get externalAngleBisectorAA() { return [this.vertexA, this.excenterA]; }
    get externalAngleBisectorAB() { return [this.vertexB, this.excenterA]; }
    get externalAngleBisectorAC() { return [this.vertexC, this.excenterA]; }
    get externalAngleBisectorBA() { return [this.vertexA, this.excenterB]; }
    get externalAngleBisectorBB() { return [this.vertexB, this.excenterB]; }
    get externalAngleBisectorBC() { return [this.vertexC, this.excenterB]; }
    get externalAngleBisectorCA() { return [this.vertexA, this.excenterC]; }
    get externalAngleBisectorCB() { return [this.vertexB, this.excenterC]; }
    get externalAngleBisectorCC() { return [this.vertexC, this.excenterC]; }
    
    get ninePointCircleCenter() { return this.fromTriangleCenterFunction(ninePointTriangleCenterFunction); }

    get ninePointCircleRadius() {
	return this.circumcircleRadius / 2;
    }
    
    get ninePointCircle() {
	return [this.ninePointCircleCenter, this.ninePointCircleRadius];
    }

    get lemoine() { return this.fromTriangleCenterFunction(lemoineTriangleCenterFunction); }
    get symmedianA() { return this.cevianAFromTriangleCenterFunction(lemoineTriangleCenterFunction); }
    get symmedianB() { return this.cevianCFromTriangleCenterFunction(lemoineTriangleCenterFunction); }
    get symmedianC() { return this.cevianBFromTriangleCenterFunction(lemoineTriangleCenterFunction); }

    get gergonne() { return this.fromTriangleCenterFunction(gergonneTriangleCenterFunction); }
    get gergonneCevianA() { return this.cevianAFromTriangleCenterFunction(gergonneTriangleCenterFunction); }
    get gergonneCevianB() { return this.cevianBFromTriangleCenterFunction(gergonneTriangleCenterFunction); }
    get gergonneCevianC() { return this.cevianCFromTriangleCenterFunction(gergonneTriangleCenterFunction); }


    get nagel() { return this.fromTriangleCenterFunction(nagelTriangleCenterFunction); }
    get nagelCevianA() { return this.cevianAFromTriangleCenterFunction(nagelTriangleCenterFunction); }
    get nagelCevianB() { return this.cevianBFromTriangleCenterFunction(nagelTriangleCenterFunction); }
    get nagelCevianC() { return this.cevianCFromTriangleCenterFunction(nagelTriangleCenterFunction); }

    get eulerLine() { return [this.circumcenter, this.orthocenter]; }
}

const triangle = new Triangle(0, 0, 0, 0, 0, 0);

const initialTriangle = [[.45, .2], [.3, .8], [.7, .8]];

const initializeTriangle = () => {
    const canvas = document.getElementById("triangle-canvas");
    const rect = canvas.getBoundingClientRect();
    triangle.vertexAX = rect.width * initialTriangle[0][0];
    triangle.vertexAY = rect.height * initialTriangle[0][1];
    triangle.vertexBX = rect.width * initialTriangle[1][0];
    triangle.vertexBY = rect.height * initialTriangle[1][1];
    triangle.vertexCX = rect.width * initialTriangle[2][0];
    triangle.vertexCY = rect.height * initialTriangle[2][1];
    triangleFormConfigurations.forEach((config) => {
	const colorPicker = document.getElementById(config["color-picker-id"]);
	config["visibility-checkboxes"].forEach((checkboxConfig) => {
	    const checkbox = document.getElementById(checkboxConfig["id"]);
	    checkboxConfig["target"].forEach((id) => {
		const elt = document.getElementById(id);
		elt.setAttribute(checkboxConfig["color-attribute"], colorPicker.value);
		elt.setAttribute("visibility", checkbox.checked ? "visible" : "hidden");
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

const triangleUpdateConfigurations = [{
    "checkbox-id": "incenter-config__incenter",
    "type": "point",
    "target": [{"id": "triangle__incenter", "get-shape": () => triangle.incenter}]
}, {
    "checkbox-id": "incenter-config__internal-angle-bisector",
    "type": "segment",
    "target": [
	{"id": "triangle__internal-angle-bisector-a", "get-shape": () => triangle.internalAngleBisectorA},
	{"id": "triangle__internal-angle-bisector-b", "get-shape": () => triangle.internalAngleBisectorB},
	{"id": "triangle__internal-angle-bisector-c", "get-shape": () => triangle.internalAngleBisectorC}
    ]
}, {
    "checkbox-id": "incenter-config__incircle-radius",
    "type": "segment",
    "target": [
	{"id": "triangle__incircle-radius-a", "get-shape": () => triangle.incircleRadiusA},
	{"id": "triangle__incircle-radius-b", "get-shape": () => triangle.incircleRadiusB},
	{"id": "triangle__incircle-radius-c", "get-shape": () => triangle.incircleRadiusC}
    ]
}, {
    "checkbox-id": "incenter-config__incircle",
    "type": "circle",
    "target": [{"id": "triangle__incircle", "get-shape": () => triangle.incircle}]
}, {
    "checkbox-id": "centroid-config__centroid",
    "type": "point",
    "target": [{"id": "triangle__centroid", "get-shape": () => triangle.centroid}]
}, {
    "checkbox-id": "centroid-config__median",
    "type": "segment",
    "target": [
	{"id": "triangle__median-a", "get-shape": () => triangle.medianA},
	{"id": "triangle__median-b", "get-shape": () => triangle.medianB},
	{"id": "triangle__median-c", "get-shape": () => triangle.medianC}
    ]
}, {
    "checkbox-id": "circumcenter-config__circumcenter",
    "type": "point",
    "target": [{"id": "triangle__circumcenter", "get-shape": () => triangle.circumcenter}]
}, {
    "checkbox-id": "circumcenter-config__circumcircle",
    "type": "circle",
    "target": [{"id": "triangle__circumcircle", "get-shape": () => triangle.circumcircle}]
}, {
    "checkbox-id": "circumcenter-config__edge-bisector",
    "type": "segment",
    "target": [
	{"id": "triangle__edge-bisector-a", "get-shape": () => triangle.edgeBisectorA},
	{"id": "triangle__edge-bisector-b", "get-shape": () => triangle.edgeBisectorB},
	{"id": "triangle__edge-bisector-c", "get-shape": () => triangle.edgeBisectorC}
    ]
}, {
    "checkbox-id": "circumcenter-config__circumcircle-radius",
    "type": "segment",
    "target": [
	{"id": "triangle__circumcircle-radius-a", "get-shape": () => triangle.circumcircleRadiusA},
	{"id": "triangle__circumcircle-radius-b", "get-shape": () => triangle.circumcircleRadiusB},
	{"id": "triangle__circumcircle-radius-c", "get-shape": () => triangle.circumcircleRadiusC}
    ]
}, {
    "checkbox-id": "orthocenter-config__orthocenter",
    "type": "point",
    "target": [{"id": "triangle__orthocenter", "get-shape": () => triangle.orthocenter}]
}, {
    "checkbox-id": "orthocenter-config__altitude",
    "type": "segment",
    "target": [
	{"id": "triangle__altitude-a", "get-shape": () => triangle.altitudeA},
	{"id": "triangle__altitude-b", "get-shape": () => triangle.altitudeB},
	{"id": "triangle__altitude-c", "get-shape": () => triangle.altitudeC}
    ]
}, {
    "checkbox-id": "excenter-config__excenter",
    "type": "point",
    "target": [
	{"id": "triangle__excenter-a", "get-shape": () => triangle.excenterA},
	{"id": "triangle__excenter-b", "get-shape": () => triangle.excenterB},
	{"id": "triangle__excenter-c", "get-shape": () => triangle.excenterC}
    ]
}, {
    "checkbox-id": "excenter-config__excircle",
    "type": "circle",
    "target": [
	{"id": "triangle__excircle-a", "get-shape": () => triangle.excircleA},
	{"id": "triangle__excircle-b", "get-shape": () => triangle.excircleB},
	{"id": "triangle__excircle-c", "get-shape": () => triangle.excircleC}
    ]
}, {
    "checkbox-id": "excenter-config__external-angle-bisector",
    "type": "segment",
    "target": [
	{"id": "triangle__external-angle-bisector-aa", "get-shape": () => triangle.externalAngleBisectorAA},
	{"id": "triangle__external-angle-bisector-ab", "get-shape": () => triangle.externalAngleBisectorAB},
	{"id": "triangle__external-angle-bisector-ac", "get-shape": () => triangle.externalAngleBisectorAC},
	{"id": "triangle__external-angle-bisector-ba", "get-shape": () => triangle.externalAngleBisectorBA},
	{"id": "triangle__external-angle-bisector-bb", "get-shape": () => triangle.externalAngleBisectorBB},
	{"id": "triangle__external-angle-bisector-bc", "get-shape": () => triangle.externalAngleBisectorBC},
	{"id": "triangle__external-angle-bisector-ca", "get-shape": () => triangle.externalAngleBisectorCA},
	{"id": "triangle__external-angle-bisector-cb", "get-shape": () => triangle.externalAngleBisectorCB},
	{"id": "triangle__external-angle-bisector-cc", "get-shape": () => triangle.externalAngleBisectorCC}
    ]
}, {
    "checkbox-id": "excenter-config__excircle-radius",
    "type": "segment",
    "target": [
	{"id": "triangle__excircle-radius-aa", "get-shape": () => triangle.excircleRadiusAA},
	{"id": "triangle__excircle-radius-ab", "get-shape": () => triangle.excircleRadiusAB},
	{"id": "triangle__excircle-radius-ac", "get-shape": () => triangle.excircleRadiusAC},
	{"id": "triangle__excircle-radius-ba", "get-shape": () => triangle.excircleRadiusBA},
	{"id": "triangle__excircle-radius-bb", "get-shape": () => triangle.excircleRadiusBB},
	{"id": "triangle__excircle-radius-bc", "get-shape": () => triangle.excircleRadiusBC},
	{"id": "triangle__excircle-radius-ca", "get-shape": () => triangle.excircleRadiusCA},
	{"id": "triangle__excircle-radius-cb", "get-shape": () => triangle.excircleRadiusCB},
	{"id": "triangle__excircle-radius-cc", "get-shape": () => triangle.excircleRadiusCC}
    ]	
}, {
    "checkbox-id": "nine-point-circle-config__center",
    "type": "point",
    "target": [{"id": "triangle__nine-point-circle-center", "get-shape": () => triangle.ninePointCircleCenter}]
}, {
    "checkbox-id": "nine-point-circle-config__circle",
    "type": "circle",
    "target": [{"id": "triangle__nine-point-circle", "get-shape": () => triangle.ninePointCircle}]
}, {
    "checkbox-id": "lemoine-config__lemoine",
    "type": "point",
    "target": [{"id": "triangle__lemoine", "get-shape": () => triangle.lemoine}]
}, {
    "checkbox-id": "lemoine-config__symmedian",
    "type": "segment",
    "target": [
	{"id": "triangle__symmedian-a", "get-shape": () => triangle.symmedianA},
	{"id": "triangle__symmedian-b", "get-shape": () => triangle.symmedianB},
	{"id": "triangle__symmedian-c", "get-shape": () => triangle.symmedianC}
    ]
}, {
    "checkbox-id": "gergonne-config__gergonne",
    "type": "point",
    "target": [{"id": "triangle__gergonne", "get-shape": () => triangle.gergonne}]
}, {
    "checkbox-id": "gergonne-config__cevian",
    "type": "segment",
    "target": [
	{"id": "triangle__gergonne-cevian-a", "get-shape": () => triangle.gergonneCevianA},
	{"id": "triangle__gergonne-cevian-b", "get-shape": () => triangle.gergonneCevianB},
	{"id": "triangle__gergonne-cevian-c", "get-shape": () => triangle.gergonneCevianC}
    ]
}, {
    "checkbox-id": "nagel-config__nagel",
    "type": "point",
    "target": [{"id": "triangle__nagel", "get-shape": () => triangle.nagel}]
}, {
    "checkbox-id": "nagel-config__cevian",
    "type": "segment",
    "target": [
	{"id": "triangle__nagel-cevian-a", "get-shape": () => triangle.nagelCevianA},
	{"id": "triangle__nagel-cevian-b", "get-shape": () => triangle.nagelCevianB},
	{"id": "triangle__nagel-cevian-c", "get-shape": () => triangle.nagelCevianC}
    ]
}, {
    "checkbox-id": "euler-line-config__euler-line",
    "type": "segment",
    "target": [{"id": "triangle__euler-line", "get-shape": () => triangle.eulerLine}]
}];

const updateTriangle = () => {
    setPointPosition("triangle__vertex-a", triangle.vertexA);
    setPointPosition("triangle__vertex-b", triangle.vertexB);
    setPointPosition("triangle__vertex-c", triangle.vertexC);
    setSegmentPosition("triangle__edge-a", triangle.edgeA);
    setSegmentPosition("triangle__edge-b", triangle.edgeB);
    setSegmentPosition("triangle__edge-c", triangle.edgeC);
    triangleUpdateConfigurations.forEach((config) => {
	const checkbox = document.getElementById(config["checkbox-id"]);
	config["target"].forEach((targetConfig) => {
	    switch (config["type"]) {
	    case "point":
		setPointPosition(targetConfig["id"], targetConfig["get-shape"]());
		break;
	    case "segment":
		setSegmentPosition(targetConfig["id"], targetConfig["get-shape"]());
		break;
	    case "circle":
		setCirclePosition(targetConfig["id"], targetConfig["get-shape"]());
		break;
	    }
	});
    });
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

const createColorPickerInputListener = (checkboxConfs) => (e) => {
    checkboxConfs.forEach((checkboxConf) => {
	checkboxConf["target"].forEach((id) => {
	    document.getElementById(id).setAttribute(checkboxConf["color-attribute"], e.target.value);
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
const triangleFormConfigurations = [{
    "color-picker-id": "centroid-config__color",
    "visibility-checkboxes": [{
	"id": "centroid-config__centroid",
	"color-attribute": "fill",
	"target": ["triangle__centroid"]
    }, {
	"id": "centroid-config__median",
	"color-attribute": "stroke",
	"target": ["triangle__median-a", "triangle__median-b", "triangle__median-c"]
    }]
}, {
    "color-picker-id": "incenter-config__color",
    "visibility-checkboxes": [{
	"id": "incenter-config__incenter",
	"color-attribute": "fill",
	"target": ["triangle__incenter"]
    }, {
	"id": "incenter-config__internal-angle-bisector",
	"color-attribute": "stroke",
	"target": ["triangle__internal-angle-bisector-a", "triangle__internal-angle-bisector-b", "triangle__internal-angle-bisector-c"]
    }, {
	"id": "incenter-config__incircle",
	"color-attribute": "stroke",
	"target": ["triangle__incircle"]
    }, {
	"id": "incenter-config__incircle-radius",
	"color-attribute": "stroke",
	"target": ["triangle__incircle-radius-a", "triangle__incircle-radius-b", "triangle__incircle-radius-c"]
    }]
}, {
    "color-picker-id": "circumcenter-config__color",
    "visibility-checkboxes": [{
	"id": "circumcenter-config__circumcenter",
	"color-attribute": "fill",
	"target": ["triangle__circumcenter"]
    }, {
	"id": "circumcenter-config__circumcircle",
	"color-attribute": "stroke",
	"target": ["triangle__circumcircle"]
    }, {
	"id": "circumcenter-config__edge-bisector",
	"color-attribute": "stroke",
	"target": ["triangle__edge-bisector-a", "triangle__edge-bisector-b", "triangle__edge-bisector-c"]
    }, {
	"id": "circumcenter-config__circumcircle-radius",
	"color-attribute": "stroke",
	"target": ["triangle__circumcircle-radius-a", "triangle__circumcircle-radius-b", "triangle__circumcircle-radius-c"]
    }]
}, {
    "color-picker-id": "orthocenter-config__color",
    "visibility-checkboxes": [{
	"id": "orthocenter-config__orthocenter",
	"color-attribute": "fill",
	"target": ["triangle__orthocenter"]
    }, {
	"id": "orthocenter-config__altitude",
	"color-attribute": "stroke",
	"target": ["triangle__altitude-a", "triangle__altitude-b", "triangle__altitude-c"]
    }]
}, {
    "color-picker-id": "excenter-config__color",
    "visibility-checkboxes": [{
	"id": "excenter-config__excenter",
	"color-attribute": "fill",
	"target": ["triangle__excenter-a", "triangle__excenter-b", "triangle__excenter-c"]
    }, {
	"id": "excenter-config__excircle",
	"color-attribute": "stroke",
	"target": ["triangle__excircle-a", "triangle__excircle-b", "triangle__excircle-c"]
    }, {
	"id": "excenter-config__external-angle-bisector",
	"color-attribute": "stroke",
	"target": [
	    "triangle__external-angle-bisector-aa", "triangle__external-angle-bisector-ab", "triangle__external-angle-bisector-ac",
	    "triangle__external-angle-bisector-ba", "triangle__external-angle-bisector-bb", "triangle__external-angle-bisector-bc",
	    "triangle__external-angle-bisector-ca", "triangle__external-angle-bisector-cb", "triangle__external-angle-bisector-cc"
	]
    }, {
	"id": "excenter-config__excircle-radius",
	"color-attribute": "stroke",
	"target": [
	    "triangle__excircle-radius-aa", "triangle__excircle-radius-ab", "triangle__excircle-radius-ac",
	    "triangle__excircle-radius-ba", "triangle__excircle-radius-bb", "triangle__excircle-radius-bc",
	    "triangle__excircle-radius-ca", "triangle__excircle-radius-cb", "triangle__excircle-radius-cc"
	]
    }]
}, {
    "color-picker-id": "nine-point-circle-config__color",
    "visibility-checkboxes": [{
	"id": "nine-point-circle-config__center",
	"color-attribute": "fill",
	"target": ["triangle__nine-point-circle-center"]
    }, {
	"id": "nine-point-circle-config__circle",
	"color-attribute": "stroke",
	"target": ["triangle__nine-point-circle"]
    }]
}, {
    "color-picker-id": "lemoine-config__color",
    "visibility-checkboxes": [{
	"id": "lemoine-config__lemoine",
	"color-attribute": "fill",
	"target": ["triangle__lemoine"]
    }, {
	"id": "lemoine-config__symmedian",
	"color-attribute": "stroke",
	"target": ["triangle__symmedian-a", "triangle__symmedian-b", "triangle__symmedian-c"]
    }]
}, {
    "color-picker-id": "gergonne-config__color",
    "visibility-checkboxes": [{
	"id": "gergonne-config__gergonne",
	"color-attribute": "fill",
	"target": ["triangle__gergonne"]
    }, {
	"id": "gergonne-config__cevian",
	"color-attribute": "stroke",
	"target": ["triangle__gergonne-cevian-a", "triangle__gergonne-cevian-b", "triangle__gergonne-cevian-c"]
    }]
}, {
    "color-picker-id": "nagel-config__color",
    "visibility-checkboxes": [{
	"id": "nagel-config__nagel",
	"color-attribute": "fill",
	"target": ["triangle__nagel"]
    }, {
	"id": "nagel-config__cevian",
	"color-attribute": "stroke",
	"target": ["triangle__nagel-cevian-a", "triangle__nagel-cevian-b", "triangle__nagel-cevian-c"]
    }]
}, {
    "color-picker-id": "euler-line-config__color",
    "visibility-checkboxes": [{
	"id": "euler-line-config__euler-line",
	"color-attribute": "stroke",
	"target": ["triangle__euler-line"]
    }]
}];

window.addEventListener("load", () => {
    initializeTriangle();
    triangleVertexIds.forEach((id) => {
	const elt = document.getElementById(id);
	elt.addEventListener("mouseenter", triangleVertexMouseEnterListener);
	elt.addEventListener("mouseleave", triangleVertexMouseLeaveListener);
	elt.addEventListener("mousedown", triangleVertexMouseDownListener);
	elt.addEventListener("mouseup", triangleVertexMouseUpListener);
    });
    triangleFormConfigurations.forEach((config) => {
	document.getElementById(config["color-picker-id"]).addEventListener("input", createColorPickerInputListener(config["visibility-checkboxes"]));
	config["visibility-checkboxes"].forEach((checkboxConfig) => {
	    document.getElementById(checkboxConfig["id"]).addEventListener("input", createVisibilityCheckboxInputListener(checkboxConfig["target"]));
	});
    });
});

window.moduleLoaded = true;
