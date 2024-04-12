The frontend website of the [Polymer IBC Inspector](https://ibcinspector.com). This website is built with [Next.js](https://nextjs.org/), and should be run in conjunction with the [polymer-ibc-indexer](https://github.com/stevenlei/polymer-ibc-indexer) and [polymer-ibc-inspector-socket](https://github.com/stevenlei/polymer-ibc-inspector-socket).

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy the `.env.example` file to `.env.local` and fill in the necessary environment variables:
   - `NEXT_PUBLIC_SOCKET_URL` - the URL of the **polymer-ibc-inspector-socket** server
   - `NEXT_PUBLIC_API_URL` - the URL of the **polymer-ibc-indexer** server
4. Run the development server with `npm run dev`

## Deployment

Deploy the website with standard Next.js deployment methods.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License
