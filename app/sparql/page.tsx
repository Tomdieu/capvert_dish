"use client";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import { FormEvent, useEffect, useState } from "react"
import { Play } from "lucide-react";
import { useSparql } from "@/hooks/sparql.hooks";
import { Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const executeSparqlQuery = (endpoint: string, query: string): Promise<SPARQLResult> => {
  return new Promise<SPARQLResult>((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST', // Assuming POST method is required for SPARQL queries
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Adjust the content type as needed
      },
      body: new URLSearchParams({
        query: query,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: SPARQLResult) => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default function SparQlPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SPARQLResult>()
  const [error, setError] = useState<string | null>(null);

  const { query, setQuery, endPoint, setEndPoint } = useSparql()

  useEffect(() => {
    setEndPoint("http://localhost:3030/cap-vert-dish/query");
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null); // Resetting error state
    executeSparqlQuery(endPoint, query)
      .then((data: SPARQLResult) => {
        setTimeout(() => {
          setResult(data)
          setLoading(false)
        }, 1000)
      })
      .catch((error) => {
        setError("Error executing SPARQL query: " + error.message);
        setLoading(false);
      });
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <Header />
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">SPARQL Query</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your SPARQL query and see the results.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Query</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" method="post" onSubmit={handleSubmit}>
              <label htmlFor="endPpoint" className="">SPARQL Endpoint</label>
              <Input id="endPpoint" placeholder="Sparql endpoint" type="url" name="url" required value={endPoint} onChange={(e) => setEndPoint(e.target.value)} />
              <label htmlFor="query" className="">SQuery Text</label>

              <Textarea value={query} onChange={e => setQuery(e.target.value)} required className="h-40" id="query" name="query" placeholder="Enter your SPARQL query here..." />
              <Button type="submit">  <Play className="mr-2 h-4 w-4" /> Execute Query</Button>
            </form>
          </CardContent>
        </Card>
        <section>
          {loading && <div className="flex flex-1 h-full w-full items=-center justify-center">
            <Loader size={64} className="animate-spin " />
          </div>}
          {error && <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>}
          {!loading && !error && <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {result &&
                        result.head.vars.map((varName, index) => (
                          <TableHead key={index}>{varName}</TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result &&
                      result.results.bindings.map((binding, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {result.head.vars.map((varName, colIndex) => {
                            let cellValue = binding[varName].value.toString();
                            // Check if the cell value is a URL
                            if (cellValue.startsWith('http://') || cellValue.startsWith('https://')) {
                              // Check if the URL is from GitHub and append ?raw=true if it's missing
                              if (cellValue.includes('github.com') && !cellValue.includes('?raw=true')) {
                                cellValue += '?raw=true';
                              }
                              // Check if the URL ends with an image file extension
                              const isImageUrl = /\.(jpg|jpeg|png|gif|bmp)/i.test(cellValue);

                              console.log({cellValue,isImageUrl})
                              return (
                                <TableCell key={colIndex}>
                                  {isImageUrl ? (
                                    <Image src={cellValue} alt={cellValue} height="200" style={{
                                      aspectRatio: "300/200",
                                      objectFit: "cover",
                                    }}
                                      width="300" />
                                  ) : (
                                    <Link className="text-primary" href={cellValue} target="_blank" rel="noopener noreferrer">
                                      {cellValue}
                                    </Link>
                                  )}
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell key={colIndex}>
                                  {cellValue}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>


                      ))}
                  </TableBody>
                </Table>

              </div>
            </CardContent>
          </Card>}
        </section>
      </div>
    </div>
  )
}
