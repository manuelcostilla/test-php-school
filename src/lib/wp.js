// src/lib/wp.js

// Define el dominio de tu sitio de WordPress
const domain = "https://clic.baradero.gob.ar";
const requestUrl = `${domain}/wp-json/wp/v2`;

// conseguir la informacion de las pages
export const getPageInfo = async (slug) => {
  try {
    const response = await fetch(`${requestUrl}/pages?slug=${slug}`);
    if (!response.ok)
      throw new Error(`Error en getPageInfo: ${response.statusText}`);
    const [data] = await response.json();
    const {
      id,
      title: { rendered: title },
      content: { rendered: content },
    } = data;
    return { id, title, content };
  } catch (error) {
    console.error("Error en getPageInfo:", error);
    return null;
  }
};

// conseguir la informacion de los post
export const getPostInfo = async (slug) => {
  try {
    // Pedimos también los embeds para que incluya la imagen
    const response = await fetch(`${requestUrl}/posts?slug=${slug}&_embed`);
    if (!response.ok) {
      throw new Error(`Error en getPostInfo: ${response.statusText}`);
    }

    const results = await response.json();
    if (!results.length) {
      console.warn(`No se encontró ningún post con slug: ${slug}`);
      return null;
    }

    const post = results[0];
    const {
      title: { rendered: title },
      content: { rendered: content },
    } = post;

    // Imagen destacada
    const featuredImage =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

    return { title, content, featuredImage };
  } catch (error) {
    console.error("Error en getPostInfo:", error);
    return null;
  }
};

// conseguir de la ultima publicacion y renderizarlo dentro de la pagina principal
export const getLastPost = async ({ perPage = 10 }) => {
  try {
    const response = await fetch(
      `${requestUrl}/posts?per_page=${perPage}&_embed`
    );

    if (!response.ok)
      throw new Error(`Error en getLastPost: ${response.statusText}`);

    const results = await response.json();
    if (!results.length) throw new Error("no post found");

    const posts = results.map((post) => {
      const {
        title: { rendered: title },
        content: { rendered: content },
        excerpt: { rendered: excerpt },
        date,
        slug,
      } = post;

      const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      const author = post._embedded?.author?.[0]?.name || "Unknown Author";

      return { title, content, excerpt, date, slug, author, featuredImage };
    });
    return posts;
  } catch (error) {
    console.error("Error en getLastPost:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const getPostsByCategory = async (categoryId, { perPage = 10 } = {}) => {
  try {
    const response = await fetch(
      `${requestUrl}/posts?categories=${categoryId}&per_page=${perPage}&_embed`
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching posts for category ID ${categoryId}: ${response.statusText}`
      );
    }

    const results = await response.json();
    if (!results.length) {
      console.warn(`No posts found for category ID: ${categoryId}`);
      return [];
    }

    const posts = results.map((post) => {
      const {
        title: { rendered: title },
        content: { rendered: content },
        excerpt: { rendered: excerpt },
        date,
        slug,
      } = post;

      const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      const author = post._embedded?.author?.[0]?.name || "Unknown Author";

      return { title, content, excerpt, date, slug, author, featuredImage };
    });
    return posts;
  } catch (error) {
    console.error("Error getPostsByCategory:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};
