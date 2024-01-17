
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

const initializeTriangle = () => {
    const canvas = document.getElementById("triangle-canvas");
    const rect = canvas.getBoundingClientRect();
    triangle.vertexAX = rect.width * 0.45;
    triangle.vertexAY = rect.height * 0.2;
    triangle.vertexBX = rect.width * 0.3;
    triangle.vertexCX = rect.width * 0.7;
    triangle.vertexBY = triangle.vertexCY = rect.height * 0.8;
    triangleConfigurations.forEach((config) => {
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
	setSegmentPosition("triangle__altitude-a", triangle.altitudeA);
	setSegmentPosition("triangle__altitude-b", triangle.altitudeB);
	setSegmentPosition("triangle__altitude-c", triangle.altitudeC);
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
    if (document.getElementById("excenter-config__external-angle-bisector").checked) {
	setSegmentPosition("triangle__external-angle-bisector-aa", triangle.externalAngleBisectorAA);
	setSegmentPosition("triangle__external-angle-bisector-ab", triangle.externalAngleBisectorAB);
	setSegmentPosition("triangle__external-angle-bisector-ac", triangle.externalAngleBisectorAC);
	setSegmentPosition("triangle__external-angle-bisector-ba", triangle.externalAngleBisectorBA);
	setSegmentPosition("triangle__external-angle-bisector-bb", triangle.externalAngleBisectorBB);
	setSegmentPosition("triangle__external-angle-bisector-bc", triangle.externalAngleBisectorBC);
	setSegmentPosition("triangle__external-angle-bisector-ca", triangle.externalAngleBisectorCA);
	setSegmentPosition("triangle__external-angle-bisector-cb", triangle.externalAngleBisectorCB);
	setSegmentPosition("triangle__external-angle-bisector-cc", triangle.externalAngleBisectorCC);
    }
    if (document.getElementById("excenter-config__excircle-radius").checked) {
	setSegmentPosition("triangle__excircle-radius-aa", triangle.excircleRadiusAA);
	setSegmentPosition("triangle__excircle-radius-ab", triangle.excircleRadiusAB);
	setSegmentPosition("triangle__excircle-radius-ac", triangle.excircleRadiusAC);
	setSegmentPosition("triangle__excircle-radius-ba", triangle.excircleRadiusBA);
	setSegmentPosition("triangle__excircle-radius-bb", triangle.excircleRadiusBB);
	setSegmentPosition("triangle__excircle-radius-bc", triangle.excircleRadiusBC);
	setSegmentPosition("triangle__excircle-radius-ca", triangle.excircleRadiusCA);
	setSegmentPosition("triangle__excircle-radius-cb", triangle.excircleRadiusCB);
	setSegmentPosition("triangle__excircle-radius-cc", triangle.excircleRadiusCC);
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
    if (document.getElementById("nagel-config__nagel").checked)
	setPointPosition("triangle__nagel", triangle.nagel);
    if (document.getElementById("nagel-config__cevian").checked) {
	setSegmentPosition("triangle__nagel-cevian-a", triangle.nagelCevianA);
	setSegmentPosition("triangle__nagel-cevian-b", triangle.nagelCevianB);
	setSegmentPosition("triangle__nagel-cevian-c", triangle.nagelCevianC);
    }
    if (document.getElementById("euler-line-config__euler-line").checked) {
	setSegmentPosition("triangle__euler-line", triangle.eulerLine);
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
const triangleConfigurations = [{
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
    triangleConfigurations.forEach((config) => {
	document.getElementById(config["color-picker-id"]).addEventListener("input", createColorPickerInputListener(config["visibility-checkboxes"]));
	config["visibility-checkboxes"].forEach((checkboxConfig) => {
	    document.getElementById(checkboxConfig["id"]).addEventListener("input", createVisibilityCheckboxInputListener(checkboxConfig["target"]));
	});
    });
});

window.moduleLoaded = true;
