let ballCenter1,ballCenter2 //两个球的中心点

function metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, escaped, r) { 
    return [ 'M', p1, 
             'C', h1, h3, p3, 
             'A', r, r, 0, escaped ? 1 : 0, 0, p4, 
             'C', h4, h3, p4, 
    ].join(' '); 
}

function dist(center1,center2){
    return Math.sqrt(Math.pow(center2[1]-center1[1],2)+Math.pow(center2[0]-center1[0],2))
}

function angle(center1,center2){
    return Math.atan((center2[1]-center1[1])/(center2[0]-center1[0]))
}

function getVector(center,angle,radius) {
    let type = 1

    if(ballCenter2[0]<ballCenter1[0]) type = -1
    
    let a = Math.sin(angle) * radius * type
    let b = Math.cos(angle) * radius * type

    return [center[0]+b,center[1]+a]
}

export const metaball = function (radius1, radius2, center1, center2, handleSize = 2.4, v = 0.5){ 

    const HALF_PI = Math.PI / 2; 
    const d = dist(center1, center2); 
    const maxDist = radius1 + radius2 * 2.5; 
    let u1, u2;
    ballCenter1 = center1,ballCenter2=center2;

    // No blob if a radius is 0 
    // or if distance between the circles is larger than max-dist 
    // or if circle2 is completely inside circle1 
    if (radius1 === 0 || radius2 === 0 || d > maxDist || d <= Math.abs(radius1 - radius2)) { 
        return ''; 
    }

    // Calculate u1 and u2 if the circles are overlapping 
    if (d < radius1 + radius2) { 
        u1 = Math.acos( (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d), ); 
        u2 = Math.acos( (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d), ); 
    } else { // Else set u1 and u2 to zero 
        u1 = 0; 
        u2 = 0; 
    }

    // Calculate the max spread 
    const angleBetweenCenters = angle(center2, center1); 
    const maxSpread = Math.acos((radius1 - radius2) / d); 
    // Angles for the points 
    const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v; 
    const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v; 
    const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v; 
    const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v; 
    // Point locations 
    const p1 = getVector(center1, angle1, radius1); 
    const p2 = getVector(center1, angle2, radius1); 
    const p3 = getVector(center2, angle3, radius2); 
    const p4 = getVector(center2, angle4, radius2); 
    // Define handle length by the distance between both ends of the curve 
    const totalRadius = radius1 + radius2; 
    const d2Base = Math.min(v * handleSize, dist(p1, p3) / totalRadius); 
    // Take into account when circles are overlapping 
    const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2)); 
    // Length of the handles 
    const r1 = radius1 * d2; 
    const r2 = radius2 * d2; 
    // Handle locations 
    const h1 = getVector(p1, angle1 - HALF_PI, r1); 
    const h2 = getVector(p2, angle2 + HALF_PI, r1); 
    const h3 = getVector(p3, angle3 + HALF_PI, r2); 
    const h4 = getVector(p4, angle4 - HALF_PI, r2);

    // Generate the connector path 
    // return metaballToPath( p1, p2, p3, p4, h1, h2, h3, h4, d > radius1, radius2, );
    
    if(d+radius2<=radius1) return [] //完全重叠
    else if(d>radius1+radius2) return [p1, h1] //完全不重叠
    else return [ p1, h1, h3, p3, p4, h4, h2, p2]; //重叠
}