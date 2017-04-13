import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'i18n-project-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  providers: []
})

export class ProjectSectionComponent implements OnInit {
  @Input() properties;

  constructor() {

  }

  ngOnInit() {

  }

  isSection(property): boolean {
    return this.isTranslation(property) === false;
  }

  isTranslation(property): boolean {
    return typeof property.value === 'string';
  }

}
