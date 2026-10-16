import { Button } from '@mas/components-all'
import '@mas/components-all/style.css'

export default () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Button size="small">Small</Button>
    <Button size="medium" variant="primary">
      Medium
    </Button>
    <Button size="large" variant="danger">
      Large
    </Button>
  </div>
)
