import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import PluginTierLabel from 'components/plugin-tier-label'
import DevAlert from 'components/dev-alert'
import Checklist from 'components/checklist'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path and remote plugin docs loading
const additionalComponents = { PluginTierLabel, Checklist }
const baseRoute = 'docs'
const localContentDir = 'content/docs'
const mainBranch = 'master'
const navDataFile = 'data/docs-nav-data.json'
const product = { name: productName, slug: productSlug }
// const remotePluginsFile = 'data/docs-remote-plugins.json'

export default function DocsLayout({ isDevMissingRemotePlugins, ...props }) {
  return (
    <>
      {isDevMissingRemotePlugins ? (
        <DevAlert>
          <strong className="g-type-label-strong">
            Note for local development
          </strong>
          <p>
            <span role="img" aria-label="Alert: ">
              🚨
            </span>{' '}
            <strong>This preview is missing plugin docs</strong> pulled from
            remote repos.
          </p>

          <p>
            <span role="img" aria-label="Fix: ">
              🛠
            </span>{' '}
            <strong>To preview docs pulled from plugin repos</strong>, please
            include a <code>GITHUB_API_TOKEN</code> in{' '}
            <code>website/.env.local</code>.
          </p>
        </DevAlert>
      ) : null}
      <DocsPage
        additionalComponents={additionalComponents}
        baseRoute={baseRoute}
        product={product}
        staticProps={props}
        showVersionSelect={process.env.ENABLE_VERSIONED_DOCS === 'true'}
      />
    </>
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.ENABLE_VERSIONED_DOCS === 'true'
    ? {
        strategy: 'remote',
        basePath: baseRoute,
        fallback: 'blocking',
        revalidate: 360, // 1 hour
        product: productSlug,
        mainBranch: mainBranch,
      }
    : {
        strategy: 'fs',
        localContentDir: localContentDir,
        navDataFile: navDataFile,
        product: productSlug,
        revalidate: false,
        mainBranch: mainBranch,
      }
)

export { getStaticPaths, getStaticProps }
