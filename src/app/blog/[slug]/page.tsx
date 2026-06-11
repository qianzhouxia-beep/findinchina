import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from 'lucide-react'
import { NavMenu } from '@/components/nav-menu'

interface BlogPostPageProps {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count (best-effort, ignore failure)
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)
    .then(() => undefined, () => undefined)

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="FindInChina home">
            <Image
              src="/findinchina-icon.png"
              alt="FindInChina"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <span className="text-xl font-bold text-brand-600 tracking-tight">FindInChina</span>
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-6 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/blog" className="hover:text-brand-600 inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{post.title}</span>
        </div>
      </div>

      {/* Hero image */}
      {post.cover_image_url && (
        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article */}
      <article className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {post.category && (
              <span className="text-brand-600 font-medium uppercase tracking-wide text-xs">
                {post.category}
              </span>
            )}
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {post.reading_minutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.reading_minutes} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mt-3 text-balance">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-5 text-lg md:text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Body */}
          <div className="mt-10 prose prose-lg max-w-none">
            {post.body ? <BodyRenderer body={post.body} inlineImages={post.inline_images} /> : <p>No content.</p>}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-10 p-5 bg-gray-50 border-l-4 border-gray-300 text-sm text-gray-600">
            <strong>Editorial note:</strong> Pricing and product data on this site reflect each
            brand's official website at the time of writing. International retail prices (USD/EUR)
            are shown, not domestic Chinese prices.
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>© 2026 FindInChina. Independent. Curated. Verified.</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-brand-600">About</Link>
            <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Lightweight markdown renderer (no external deps to keep zero-config)
// Supports: # h1, ## h2, ### h3, **bold**, *italic*, [link](url), lists, blockquote, tables, {{IMAGE:slug}} tags
function BodyRenderer({ body, inlineImages = {} }: { body: string; inlineImages?: Record<string, string> }) {
  const lines = body.split('\n')
  const elements: JSX.Element[] = []
  let key = 0

  let inTable = false
  let tableRows: string[][] = []
  let tableHeaders: string[] = []

  let inList = false
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc pl-6 my-4 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ul>
      )
      listItems = []
    }
    inList = false
  }

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="border-b-2 border-gray-300 px-3 py-2 font-semibold"
                    dangerouslySetInnerHTML={{ __html: inlineMd(h.trim()) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-b border-gray-200 px-3 py-2"
                      dangerouslySetInnerHTML={{ __html: inlineMd(cell.trim()) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
      tableHeaders = []
    }
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Inline image marker: {{IMAGE:slug}} or {{IMAGE:slug|caption}}
    const imageMatch = trimmed.match(/^\{\{IMAGE:([^}|]+)(?:\|([^}]+))?\}\}$/)
    if (imageMatch) {
      flushList()
      flushTable()
      const slug = imageMatch[1].trim()
      const caption = imageMatch[2]?.trim()
      const imgPath = inlineImages[slug] || `/brands/${slug}.jpg`
      elements.push(
        <figure key={key++} className="my-8">
          <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded">
            <Image
              src={imgPath}
              alt={caption || slug}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      )
      continue
    }

    // Table detection: lines starting with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList()
      if (!inTable) {
        inTable = true
      }
      const cells = trimmed.slice(1, -1).split('|')
      // Check if separator row (|---|---|)
      if (cells.every((c) => /^[-:\s]+$/.test(c))) {
        continue
      }
      if (tableHeaders.length === 0) {
        tableHeaders = cells
      } else {
        tableRows.push(cells)
      }
      continue
    } else {
      flushTable()
    }

    // Lists
    if (trimmed.startsWith('- ')) {
      if (!inList) inList = true
      listItems.push(trimmed.slice(2))
      continue
    } else {
      flushList()
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-8 mb-3" dangerouslySetInnerHTML={{ __html: inlineMd(trimmed.slice(4)) }} />
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold tracking-tight mt-12 mb-4" dangerouslySetInnerHTML={{ __html: inlineMd(trimmed.slice(3)) }} />
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-3xl font-bold tracking-tight mt-12 mb-4" dangerouslySetInnerHTML={{ __html: inlineMd(trimmed.slice(2)) }} />
      )
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key++}
          className="border-l-4 border-brand-600 pl-4 italic text-gray-700 my-4"
          dangerouslySetInnerHTML={{ __html: inlineMd(trimmed.slice(2)) }}
        />
      )
    } else if (trimmed === '---') {
      elements.push(<hr key={key++} className="my-8 border-gray-200" />)
    } else if (trimmed === '') {
      // skip blank lines
    } else {
      elements.push(
        <p
          key={key++}
          className="my-4 text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: inlineMd(trimmed) }}
        />
      )
    }
  }
  flushList()
  flushTable()

  return <>{elements}</>
}

function inlineMd(text: string): string {
  // Escape HTML
  let s = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Italic
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // Links
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">$1</a>'
  )

  return s
}
