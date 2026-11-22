import Head from 'next/head';

const SITE_URL = 'https://arifkursadkavas.github.io';
const IMAGE_URL = `${SITE_URL}/arif.jpg`;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

export default function Seo({ title, description, path, noIndex = false, structuredData }: SeoProps) {
  const canonicalUrl = path && !noIndex ? new URL(path, SITE_URL).toString() : undefined;

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='author' content='Arif Kürsad Kavas' />
      <meta name='robots' content={noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='Arif Kürsad Kavas' />
      <meta property='og:locale' content='en_US' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={IMAGE_URL} />
      <meta property='og:image:alt' content='Arif Kürsad Kavas' />
      {canonicalUrl && <meta property='og:url' content={canonicalUrl} />}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={IMAGE_URL} />
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {structuredData && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </Head>
  );
}
