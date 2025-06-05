const domain = "https://delicately0e0b72c485-aslgy-studio.wp.build";
const requestUrl = `${domain}/wp-json/wp/v2`;

// conseguir la informacion de las pages

export const getPageInfo = async (slug) => {
  const response = await fetch(`${requestUrl}/pages?slug=${slug}`);
  if (!response.ok) throw new Error("error");
  const [data] = await response.json();
  const {
    title: { rendered: title },
    content: { rendered: content },
  } = data;
  return { title, content };
};

// conseguir la informacion de los post
export const getPostInfo = async (slug) => {
  const response = await fetch(`${requestUrl}/posts?slug=${slug}`);
  if (!response.ok) throw new Error("error");
  const [data] = await response.json();
  const {
    title: { rendered: title },
    content: { rendered: content },
  } = data;
  return { title, content };
};

// conseguir de la ultima publicacion y renderizarlo dentro de la pagina principal

export const getLastPost = async ({ perPage = 10 }) => {
  const response = await fetch(
    `${requestUrl}/posts?per_page=${perPage}&_embed`
  );

  if (!response.ok) throw new Error("error");

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

    const featuredImage = post._embedded["wp:featuredmedia"][0].source_url;
    const author = post._embedded.author[0].name;
    console.log(author);

    return { title, content, excerpt, date, slug, author, featuredImage };
  });
  return posts;
};
