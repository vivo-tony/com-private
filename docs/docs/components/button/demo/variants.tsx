import { Button } from '@mas/components-all'
import '@mas/components-all/style.css'

export default () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="default">Default</Button>
    <Button variant="danger">Danger</Button>
  </div>
)
