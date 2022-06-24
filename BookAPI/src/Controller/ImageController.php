<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Image;
use App\Repository\ImageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ImageController extends AbstractController
{
    #[Route('/api/images', name: 'images', methods: ['GET'])]
    public function getAllImages(ImageRepository $imageRepository, SerializerInterface $serializer): JsonResponse
    {
        $imageList = $imageRepository->findAll();
        $jsonImageList = $serializer->serialize($imageList, 'json', ['groups' => 'getImage']);
        return new JsonResponse($jsonImageList, Response::HTTP_OK, [], true);
    }

    #[Route('/api/images/{id}', name: 'detailImage', methods: ['GET'])]
    public function getDetailBook(Image $image, SerializerInterface $serializer): JsonResponse
    {
        $jsonImage = $serializer->serialize($image, 'json', ['groups' => 'getImage']);
        return new JsonResponse($jsonImage, Response::HTTP_OK, [], true);
    }

    #[Route('/api/images/{id}', name: 'deleteImage', methods: ['DELETE'])]
    public function deleteImage(Image $image, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($image);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }


    #[Route('/api/images/{id}', name: "createImage", methods: ['POST'])]
    public function createImage(Book $book, Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator) //: JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $image = new Image($data['name'], $data['data']);
        $book->addImage($image);
        $em->persist($image);
        $em->flush();
        $jsonImage = $serializer->serialize($image, 'json', ['groups' => 'getImage']);
        return new JsonResponse($jsonImage, Response::HTTP_OK, [], true);
    }

    #[Route('/api/images/{id}', name: "patchImage", methods: ['PATCH'])]
    public function patchBook(Request $request, SerializerInterface $serializer, Image $currentImage, EntityManagerInterface $em): JsonResponse
    {
        $Image = $serializer->deserialize($request->getContent(), Image::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentImage]);
        $em->persist($Image);
        $em->flush();
        $jsonImage = $serializer->serialize($Image, 'json', ['groups' => 'getImage']);
        return new JsonResponse($jsonImage, Response::HTTP_OK, [], true);
    }
}
