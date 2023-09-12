// Author: Pezwari_Naan
// Title: Rainbow Sphere

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Set Our Constants
const int MAX_MARCHING_STEPS = 255;
const float MIN_DISTANCE = 0.0; 
const float MAX_DISTANCE = 100.0;
const float PRECISION = 0.0001;
const float RADIUS = 0.1;

// Signed Distance Field of a Sphere
float sdSphere( vec3 p, float s, vec3 offset)
{
	return length(p - offset) - s; 
}

// Function that renders out SDF
float sdScene(vec3 point) {
	 //Rotates across the x & y axis, but not z
     mat3 xyRotation = mat3(cos(u_time), -sin(u_time), 0.0,
                           sin(u_time), cos(u_time), 0.0,
                           0.0, 0.0 ,1.0
                          );
    
    mat3 zyRotation = mat3(1, 0.0, 0.0,
                          0.0, cos(u_time),-sin(u_time),
                          0.0, sin(u_time) ,cos(u_time)
                         );
    float sphereLeft = sdSphere(point, RADIUS, vec3(-0.2, 0.1, 0.1) * xyRotation * zyRotation);
    float sphereRight = sdSphere(point, RADIUS, vec3(0.2, 0.1, 0.1) * xyRotation * zyRotation);
    return min(sphereLeft, sphereRight);
}

// Lambert Lighting Implimentation
vec3 calculateNormal(vec3 point){
    vec2 epsilon = vec2(1.0, -1.0) * 0.0005;
    float s = RADIUS;
    return normalize(
    epsilon.xyy * sdScene(point + epsilon.xyy) +
    epsilon.yyx * sdScene(point + epsilon.yyx) +
    epsilon.yxy * sdScene(point + epsilon.yxy) +
    epsilon.xxx * sdScene(point + epsilon.xxx)
    );
}

// Use Ray Marching to Render Spheres
float rayMarch(vec3 rayOrigin, vec3 rayDirection, float start, float end) {
    float depth = start;
    
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec3 point = rayOrigin + depth * rayDirection;
        float distance = sdScene(point);
        depth += distance;
        if (distance < PRECISION || depth > end) 
            break;
    }
    return depth;
}

// Phong Reflection is made up of 3 parts:
// Ambient Term
// Diffuse Reflection
// Specular Reflection 
vec3 phong(vec3 lightDirection, vec3 normal, vec3 rayDirection){
    // Ambient
    float k_a = 0.6; // Ambient reflection constant
    vec3 i_a = vec3(abs(sin(u_time)), abs(cos(u_time)), 0.2); // controls ambient lighting
    vec3 ambient = k_a * i_a; // product of the values above
    
    //Diffuse
    float k_d = 0.7; // Diffuse reflection constant
    float dotLN = clamp(dot(lightDirection, normal), 0.0, 1.0); // Dot product of the Direction vector (light Direction ) L, and the Normal from the surface N
    vec3 i_d = vec3(sin(u_time), cos(u_time), 0.3); // Intensity (often RGB values)
    vec3 diffuse = k_d * dotLN * i_d; // Product of the above values
    
    //Specular
    float k_s = 0.7; // Specular reflection constant
    float dotRV = clamp(dot(reflect(lightDirection, normal), -rayDirection), 0.0, 1.0); // Dot product of R - direction a perfectly reflected ray of light would take and V the direction pointing towards the viewer. 
    vec3 i_s = vec3(0.4, abs(cos(u_time)), abs(sin(u_time))); // Intensity (often RGB value)
    float alpha = 5.0; // The 'shininess' constant of the material. The higher the value the smaller the specular highlight. 
    vec3 specular = k_s * pow(dotRV, alpha) * i_s; // Product of the values above 
    //Note : k_s * dotRV^alpha * i_s
    
    
    return ambient + diffuse + specular;
}


void main() {
    vec2 st = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    st.x *= u_resolution.x/u_resolution.y;
    // Initial RGB Value (0, 0, 0)
 	vec3 color = vec3(0);
    vec3 background = vec3(st * sin(u_time) + 0.5, cos(0.2));
    // Origin of our Ray. Represents 'Camera Position' 
    // Note : Sometimes this value may be inverted (-0.5 to show distance away from canvas.)
    vec3 rayOrigin = vec3(0.0, 0.0, 1.0);
    // Ray Direction Changes Based on Co-ordinates 
    // Note : 'st' is the normalised canvas x * y values. The Z values is set as -1 so the ray is moving away from the camera. 
    vec3 rayDirection = normalize(vec3(st, -1));
    // Distance From Our Sphere
	float distance = rayMarch(rayOrigin, rayDirection, MIN_DISTANCE, MAX_DISTANCE);
    //This is set so the ray will not go on forever. If this limit is reached then the sphere was missed
    if (distance > MAX_DISTANCE)
        color = background;
    else { 
        vec3 point = rayOrigin + rayDirection * distance + .04;
    	vec3 normal = calculateNormal(point);
    	vec3 lightPosition = vec3(0.1, abs(cos(u_time)), 0.0);
    	vec3 lightDirection = vec3(normalize(lightPosition - point));
        float lightIntensity = 0.65;
        color = lightIntensity * phong(lightDirection, normal, rayDirection);
    }

    gl_FragColor = vec4(color,1.0);
}