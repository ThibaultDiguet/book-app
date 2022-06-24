<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Image;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $list = [];
        for ($i = 0; $i < 20; $i++) {
            $book = new Book();
            ($i <= 9 ? $book->setIsbn('000000000000'.$i) : $book->setIsbn('00000000000'.$i));
            $book->setTitle('Livre n°'.$i);
            $book->setDescription('Description n°'.$i);
            $book->setAuthor('Author n°'.$i);
            $book->setPublication(new \DateTime() );
            $manager->persist($book);
            $list[] = $book;

        }

        for ($i = 0; $i < 20; $i++) {
            $image = new Image("Nom n°$i","Image n°$i");
            $image->setBook($list[array_rand($list,1)]);
            $manager->persist($image);
        }
        $manager->flush();
    }
}

