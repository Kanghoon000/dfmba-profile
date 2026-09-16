"""실행: python -m unittest discover -s backend -v (프로젝트 루트에서)."""
import unittest
from fastapi.testclient import TestClient
from main import app


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_greeting_and_health(self):
        self.assertEqual(self.client.get('/health').json(), {'status': 'ok'})
        response = self.client.get('/api/greeting', params={'name': '홍길동'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('홍길동님', response.json()['message'])
        self.assertIn('server_time', response.json())

    def test_input_limits(self):
        for name in ['', 'x' * 41]:
            self.assertEqual(self.client.get('/api/greeting', params={'name': name}).status_code, 422)
        self.assertEqual(self.client.get('/api/greeting', params={'name': '   '}).json()['name'], '방문자')

    def test_cors(self):
        for origin, allowed in [('http://localhost:5500', True), ('https://untrusted.example', False)]:
            response = self.client.options('/api/greeting', headers={
                'Origin': origin, 'Access-Control-Request-Method': 'GET',
            })
            self.assertEqual(response.headers.get('access-control-allow-origin'), origin if allowed else None)

    def test_swagger(self):
        self.assertEqual(self.client.get('/docs').status_code, 200)
        self.assertIn('/api/greeting', self.client.get('/openapi.json').json()['paths'])


if __name__ == '__main__':
    unittest.main()
