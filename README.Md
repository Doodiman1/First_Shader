# Rainbow Sphere - WebGL Ray Marching Demo

**Author:** Pezwari_Naan

This is a WebGL shader demo that creates a rotating rainbow-colored sphere using ray marching. It demonstrates the use of Signed Distance Fields (SDFs) and Phong reflection to achieve realistic shading effects.

## How it Works

The demo uses a series of techniques to render the rainbow sphere:

- Ray marching is employed to determine the intersection of the viewing rays with the sphere's surface.
- A signed distance field (SDF) is defined for the sphere, which calculates the distance between a point and the sphere's surface.
- Phong reflection is used to calculate the lighting effects, including ambient, diffuse, and specular reflections.

## Customization

You can customize various aspects of the sphere, such as its size, colors, and lighting properties, by modifying the shader code in the `index.html` file. Be sure to have some knowledge of GLSL (OpenGL Shading Language) to make changes effectively.

## License

This project is licensed under the GNU License - see the LICENSE file for details.

## Acknowledgments

- This demo was created with the help of https://inspirnathan.com/posts/47-shadertoy-tutorial-part-1/ and https://thebookofshaders.com/.
- It is inspired by the amazing world of ray marching and shader programming.

