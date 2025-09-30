
'use client';

import type { Post } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { deletePostAction } from '@/actions/blog-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import {formatDate} from '@/lib/utils';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    setIsDeleting(slug);
    try {
      await deletePostAction(slug);
      toast({
        title: "Publicación Eliminada",
        description: "El post ha sido eliminado correctamente."
      });
      router.refresh();
    } catch {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la publicación."
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyToClipboard = (post: Post) => {
    const markdownContent = `---
title: '${post.title}'
createdAt: '${post.createdAt}'
imageUrl: '${post.imageUrl}'
excerpt: '${post.excerpt}'
---
${post.content}`;

    navigator.clipboard.writeText(markdownContent).then(() => {
      toast({
        title: "Contenido Copiado",
        description: "El post en formato Markdown ha sido copiado al portapapeles."
      });
    }).catch(() => {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo copiar el contenido."
      });
    });
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-center">No hay publicaciones para mostrar.</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const imageSrc = post.imageUrl || '/placeholder.png';
            return (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                        <Image 
                          src={imageSrc}
                          alt={post.title} 
                          width={40} 
                          height={40} 
                          className="rounded-md object-cover hidden sm:block"
                        />
                        <span className="font-medium truncate max-w-xs">{post.title}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(post.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/gestion/blog/${post.slug}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(post)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta publicación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la publicación del blog.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.slug)}
                              disabled={isDeleting === post.slug}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isDeleting === post.slug ? 'Eliminando...' : 'Eliminar'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
